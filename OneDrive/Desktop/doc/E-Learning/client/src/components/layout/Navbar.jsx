import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBook, FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-brand">
                    <FiBook style={{ display: 'inline', marginRight: '0.5rem' }} />
                    AI Study Assistant
                </Link>

                <ul className="navbar-nav">
                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/dashboard" className="navbar-link">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <span className="navbar-link">
                                    <FiUser style={{ display: 'inline', marginRight: '0.25rem' }} />
                                    {user?.full_name}
                                </span>
                            </li>
                            <li>
                                <button onClick={logout} className="btn btn-outline">
                                    <FiLogOut />
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="btn btn-outline">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="btn btn-primary">
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
