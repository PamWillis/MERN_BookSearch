import AuthService from '../utils/auth';
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';


import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';



const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;
  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState([savedBookIds]);
  // const [savedBookIds, setSavedBookIds] = useState(savedBookIds());

  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  useEffect(() => {
    const removedBook = savedBookIds.find(bookId => bookId === removedBook);
    return () => removeBook(removedBook);
  }, [savedBookIds]);


  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    
    // create original state for which book was chosen to remove
    const [chosenBook, setChosenBook] = useState([]);
    // create state for holding our chosen field data
    const [chosenInput, setChosenInput] = useState('');

    // find the book in `savedBooks` state by the matching id
    const bookToRemove = chosenBook.find((book) => book.bookId === bookId);

    const token = AuthService.loggedIn() ? AuthService.getToken() : null;

    if (!token) {
      return false;
    }

    // Call the mutation here, assuming `removeBook` is a GraphQL mutation function
    const { Data } = await removeBook({
      variables: {
        bookId: id
      },
    });

    // If the book successfully deleted to the user's account, save the book ID to state
    setSavedBookIds([...savedBookIds, bookToRemove.bookId]);
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
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

export default SavedBooks;
