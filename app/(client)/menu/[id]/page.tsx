import FilterBar from "./components/filter-bar";
import MenuBar from "./components/menu-bar";

interface MenuPageProps {
  params: { id: string };
}

const MenuPage: React.FC<MenuPageProps> = ({ params }) => {
  // const [filteredProducts, setFilteredProducts] = useState(allProducts);

  // const handleFilterChange = (selectedFilter) => {
  //   // Filter logic based on the selected filter
  //   // For example:
  //   const newFilteredProducts = allProducts.filter((product) =>
  //     // Add your filter logic here
  //     selectedFilter.includes(product.category)
  //   );
  //   setFilteredProducts(newFilteredProducts);
  // };
  return (
    <div>
      <MenuBar />
      <FilterBar />
    </div>
  );
};

export default MenuPage;
