import { call, delay, put, race, select, take, takeLatest } from 'redux-saga/effects';
import {
    PRODUCTS_FETCH,
    PRODUCTS_FETCH_FAILURE,
    PRODUCTS_FETCH_REQUEST,
    PRODUCTS_FETCH_SUCCESS,
    PRODUCTS_POLL_START,
    PRODUCTS_POLL_STOP,
} from '../actions';
import { fetchProducts } from '../api/catalog';

const POLL_MS = 15000;

function* fetchOnce() {
    const loading = yield select(state => state.products?.loading);
    if (loading) {
        return;
    }
    try {
        yield put({ type: PRODUCTS_FETCH_REQUEST });
        const items = yield call(fetchProducts);
        yield put({
            type: PRODUCTS_FETCH_SUCCESS,
            payload: items,
            meta: { at: Date.now() },
        });
    } catch (e) {
        yield put({
            type: PRODUCTS_FETCH_FAILURE,
            error: e?.message || 'Failed to load products',
        });
    }
}

function* pollLoop() {
    // immediate refresh, then interval
    while (true) {
        yield call(fetchOnce);
        yield delay(POLL_MS);
    }
}

function* pollController() {
    while (true) {
        yield take(PRODUCTS_POLL_START);
        yield race({
            loop: call(pollLoop),
            stop: take(PRODUCTS_POLL_STOP),
        });
    }
}

export function* productsSaga() {
    yield takeLatest(PRODUCTS_FETCH, fetchOnce);
    yield call(pollController);
}

