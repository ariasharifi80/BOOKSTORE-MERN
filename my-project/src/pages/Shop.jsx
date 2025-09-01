import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import Item from "../components/Item";
import { ShopContext } from "../context/ShopContext";

const Shop = () => {
  const { books, searchQuery } = useContext(ShopContext);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredBooks(
        books.filter((book) =>
          book.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    } else {
      setFilteredBooks(books);
    }
    setCurrPage(1); // Reset to first page on search
  }, [books, searchQuery]);

  const totalPages = Math.ceil(
    filteredBooks.filter((b) => b.inStock).length / itemsPerPage,
  );
    useEffect(() =>{
      window.scrollTo({top: 0, behavior: 'smooth'})
    }, [currPage])
   
  return (
    <div className="max-padd-container py-16 pt-28">
      <Title title1={"All"} title2={"Books"} titleStyles={"pb-10"} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-8">
        {filteredBooks.length > 0 ? (
          filteredBooks
            .filter((book) => book.inStock)
            .slice((currPage - 1) * itemsPerPage, currPage * itemsPerPage)
            .map((book) => <Item key={book._id} book={book} />)
        ) : (
          <h4 className="h4">Oops! Nothing Found. </h4>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flexCenter flex-wrap gap-2 sm:gap-4 mt-14 mb-10">
        <button
          disabled={currPage === 1}
          onClick={() => setCurrPage((prev) => prev - 1)}
          className={`${currPage === 1 && "opacity-50 cursor-not-allowed"} btn-dark !py-1 !px-3`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrPage(index + 1)}
            className={`${currPage === index + 1 && "bg-secondary !text-white"} btn-light !py-1 !px3`}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currPage === totalPages}
          onClick={() => setCurrPage((prev) => prev + 1)}
          className={`${currPage === totalPages && "opacity-50 cursor-not-allowed"} btn-white bg-tertiary !py-1 !px-3`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Shop;
