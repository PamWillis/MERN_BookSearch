import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import React, { useState } from "react";

const SearchBooks = () => {
  const [formState, setFormState] = useState({
    searchInput: "",
  });

  const [searchInput, setSearchInput] = useState("");
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [savedBookIds, setSavedBookIds] = useState([]);
  const [saveBook, { error }] = useMutation(SAVE_BOOK);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const { searchInput } = formState;

    // Check if there is a value for searchInput, if not, return false
    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`
      );

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const responseData = await response.json();

      const bookData = responseData.books.map((book) => ({
        bookId: book,
        title: title,
        authors: authors,
        description: description,
        image: imageLinks?.thumbnail,
      }));

      setSearchedBooks(bookData);
      setFormState({ ...formState, searchInput: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveBook = async (bookId) => {
    try {
      const { data } = await saveBook({
        variables: { bookId },
      });

      setSavedBookIds([...savedBookIds, data.saveBook.bookId]);
    } catch (error) {
      console.error(error);
    }
  };

  return (

    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                {book.imageLinks?.thumbnail && ( 
                <Card.Img src={book.imageLinks?.thumbnail} alt={`The cover for ${book.title}`} variant='top' />
              )}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;