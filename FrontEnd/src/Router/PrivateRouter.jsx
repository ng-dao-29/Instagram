import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { loading } = useSelector(state => state.user);

    return (
      <>
        {!loading &&
          (!localStorage.getItem("token") ? <Navigate to="/login" /> : children)}
      </>
    );
};

export default PrivateRoute;