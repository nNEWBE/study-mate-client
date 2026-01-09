import Item from "./Item";
import { PRODUCTS, RESOURCES, COMPANY, SUPPORT } from "./Menus";
const ItemsContainer = () => {
  return (
    <div className="grid grid-cols-2 gap-8 px-6 py-12 text-left sm:grid-cols-2 sm:gap-10 sm:px-8 sm:py-16 sm:text-center md:grid-cols-4 md:text-center">
      <Item Links={PRODUCTS} title="PRODUCTS" />
      <Item Links={RESOURCES} title="RESOURCES" />
      <Item Links={COMPANY} title="COMPANY" />
      <Item Links={SUPPORT} title="SUPPORT" />
    </div>
  );
};

export default ItemsContainer;