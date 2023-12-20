import { gql, useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import React, { useState, useEffect } from "react";

const SearchBooks = () => {
  const [saveBook, { loading: saveLoading, error }] = useMutation(SAVE_BOOK);
  const [searchInput, setSearchInput] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSaveBook(bookId) {
    if (saveLoading) return 'Saving...';
    if (error) return `Save error! ${error.message}`;

    try {
      await saveBook({ variables: { bookId } });
    } catch (err) {
      console.error(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`);
      const data = await response.json();

      if (data.items) {
        setBooks(data.items);
      } else {
        setBooks([]);
      }
    } catch (error) {

      console.error('Error fetching data:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // query ExampleQuery {
  //   me {
  //     _id
  //     savedBooks {
  //       author
  //       bookId
  //       image
  //       link
  //       title
  //     }
  //   }
  // }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleSubmit}>
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
          {books.length
            ? `Viewing ${books.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {books.map(({volumeInfo:book}, i) => {
            console.log(book)
            return (
              <Col md="4" key={i}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
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
