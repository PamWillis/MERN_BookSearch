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


const SavedBooks = () => {
  // Initialize the mutation hook outside the component body
  const [removeBook] = useMutation(REMOVE_BOOK);

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
    try {
      // find the book in `savedBooks` state by the matching id
      const bookToRemove = savedBooks.find((book) => book.bookId === bookId);

      const token = AuthService.loggedIn() ? AuthService.getToken() : null;

      if (!token) {
        return false;
      }

      // Call the mutation here, assuming `removeBook` is a GraphQL mutation function
      await removeBook({
        variables: {
          bookId: bookToRemove.bookId,
        },
        refetchQueries: [{ query: GET_ME }], // Refetch the user data after deletion
      });

      // Update the state or perform any necessary actions after successful deletion
      // For example, you might want to refetch the data to reflect the changes
    } catch (error) {
      console.error(error);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
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
          {savedBooks.map((book, index) => (
            <Col key={`col-${book.bookId}`} md="4">
              <Card key={`card-${book.bookId}-${index}`} border='dark'>
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
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
