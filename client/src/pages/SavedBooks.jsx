import { gql, useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import {
  Container,
  Col,
  Button,
  Card,
  Row
} from 'react-bootstrap';

const SavedBooks = () => {
  // Move userData definition before using it in the query
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.Me || {};


  const [removeBookMutation, { loading: removeLoading, error: removeError }] = useMutation(REMOVE_BOOK);

  async function handleDeleteBook(bookId) {
    if (removeLoading) return 'Deleting...';
    if (removeError) return `Delete error! ${removeError.message}`;

    try {
      await removeBookMutation({ variables: { bookId } });
      localStorage.removeItem(bookId);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
     <div className="text-light bg-dark p-5 fluid">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks && userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
        {userData.savedBooks && userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
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
