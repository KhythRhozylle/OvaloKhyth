import { FlatList, Text, View } from 'react-native';
import ProductCard from './ProductCard';
import { COLORS, SPACING } from '../constants/theme';
import { chunkArray, getProductCardWidth, PRODUCT_GRID } from '../utils/layout';

/** Two-column grid inside a parent ScrollView (e.g. Home). */
export const ProductGridRows = ({ products, onProductPress }) => {
    const cardWidth = getProductCardWidth();
    const gap = PRODUCT_GRID.gap;
    const rows = chunkArray(products, PRODUCT_GRID.columns);

    if (!products.length) {
        return (
            <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>No products to show.</Text>
        );
    }

    return (
        <View>
            {rows.map((row, rowIndex) => (
                <View
                    key={`row-${rowIndex}`}
                    style={{
                        flexDirection: 'row',
                        marginBottom: gap,
                    }}
                >
                    {row.map((product, colIndex) => (
                        <ProductCard
                            key={String(product.id)}
                            product={product}
                            width={cardWidth}
                            onPress={() => onProductPress(product)}
                            style={colIndex === 0 ? { marginRight: gap } : undefined}
                        />
                    ))}
                    {row.length === 1 ? <View style={{ width: cardWidth }} /> : null}
                </View>
            ))}
        </View>
    );
};

/** Scrollable shop grid with optional header. */
const ProductGrid = ({
    products,
    onProductPress,
    ListHeaderComponent,
    ListEmptyComponent,
    contentContainerStyle,
    refreshControl,
}) => {
    const cardWidth = getProductCardWidth();
    const gap = PRODUCT_GRID.gap;

    return (
        <FlatList
            data={products}
            keyExtractor={item => String(item.id)}
            numColumns={PRODUCT_GRID.columns}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
                {
                    paddingHorizontal: SPACING.screen,
                    paddingBottom: 28,
                },
                contentContainerStyle,
            ]}
            columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: gap,
            }}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={refreshControl}
            renderItem={({ item }) => (
                <ProductCard
                    product={item}
                    width={cardWidth}
                    onPress={() => onProductPress(item)}
                />
            )}
        />
    );
};

export default ProductGrid;
