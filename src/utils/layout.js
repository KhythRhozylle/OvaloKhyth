import { Dimensions } from 'react-native';
import { SPACING } from '../constants/theme';

export const PRODUCT_GRID = {
    columns: 2,
    gap: 12,
    imageHeight: 152,
};

/** Width for one product card in the 2-column grid. */
export function getProductCardWidth() {
    const screenWidth = Dimensions.get('window').width;
    const horizontal = SPACING.screen * 2;
    const gaps = PRODUCT_GRID.gap * (PRODUCT_GRID.columns - 1);
    return (screenWidth - horizontal - gaps) / PRODUCT_GRID.columns;
}

export function chunkArray(array, size) {
    const rows = [];
    for (let i = 0; i < array.length; i += size) {
        rows.push(array.slice(i, i + size));
    }
    return rows;
}
