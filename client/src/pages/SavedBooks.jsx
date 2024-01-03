import AuthService from '../utils/auth';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';


import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SavedBooks = () => {
  // Execute the query on component load
  const { loading, data } = useQuery(GET_ME);

  // Check if data is still loading
  if (loading) {
    return <p>Loading...</p>;
  }

  // Check if data exists before attempting to access its properties
  const userData = data?.me || {}; // Use an empty object as a fallback
  const userDataLength = Object.keys(userData).length;
  const savedBooks = userData.savedBooks || [];



  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const [removeBook, { error }] = useMutation(REMOVE_BOOK);
    


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
