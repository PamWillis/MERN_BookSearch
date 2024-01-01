import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import AuthService from '../utils/auth';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';

const SearchBooks = (props) => {
  const [saveLoading, setSaveLoading] = useState(false); // Add saveLoading to the state
  const [saveBookMutation, { loading: saveMutationLoading, error }] = useMutation(SAVE_BOOK);
  const [searchInput, setSearchInput] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // You need to get the savedBookIds from your userData or some other source
  // Replace this with the actual logic to fetch the savedBookIds
  const savedBookIds = []; // Replace with your logic

  async function handleSaveBook(bookId, searchInput) {
    if (!AuthService.loggedIn()) {
      // User is not authenticated, handle accordingly (redirect to login, show a message, etc.)
      return;
    }

    if (saveLoading) {

      // Save is already in progress, handle accordingly
      return;
    }

    try {
      // Get book data from the component state
      const bookData = books.find((book) => book.bookId === bookId);
      // Added the line below to extract 'id' from 'bookData'
      const { volumeInfo, id } = bookData || {};
      const { authors, description, title, imageLinks } = volumeInfo || {};
      
      // Ensure the authors array is defined
      const authorArray = Array.isArray(authors) ? authors : (authors ? [authors] : []);
      
      // Get user data from props or component state
      const userId = props.userData?._id; // Replace with actual logic
      
      await saveBookMutation({
        variables: {
          author: authorArray,
          description,
          title,
          // Changed 'bookId: id' to map the API id to your GraphQL bookId
          bookId: id,
          image: volumeInfo.imageLinks.thumbnail,
          link: `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`,
          userId,
        },
      });
          // ... (existing code)
        } catch (err) {
          console.error('GraphQL Error:', err);

          // Log the entire error object for more details
          console.error('Complete GraphQL Error:', err);

          // Handle the error (show a message, log, etc.)
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
            console.log(data.items)
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
              {books.map(({ volumeInfo: book }, i) => {
                console.log(book)
                return (
                  <Col md="4" key={i}>
                    <Card border='dark'>
                      {book.imageLinks && book.imageLinks.thumbnail ? (
                        <Card.Img src={book.imageLinks.thumbnail} alt={`The cover for ${book.title}`} variant='top' />
                      ) : null}
                      <Card.Body>
                        <Card.Title>{book.title}</Card.Title>
                        <p className='small'>Authors: {book.authors}</p>
                        <Card.Text>{book.description}</Card.Text>
                        {AuthService.loggedIn() && (
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
