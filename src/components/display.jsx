import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { animals } from "./data";
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useMediaQuery } from 'react-responsive';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const PexelsApiKey = '9MLdBX8TJ0zff1mKgZqnsf4RNDqfQT5ZJwcBNbXZVqQ0fQ9ac0JEDZTW';

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">

          Hello, soldiers! 🪖
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>

          Greetings 🌟. I am pleased to inform you that I have successfully executed the assigned task. Within my submissions, you will find two distinct implementations: the first, a precise replica meticulously crafted as per your instructions on that designated page 📃, and the second, an innovative design conceived by my own ingenuity. Should you wish to witness the fruits of my labor, I invite you to follow this link<a href="https://dribble-clone2-0.vercel.app/" class="text-decoration-none">🔗</a>, where my creations await your appraisal.
        </p>
      </Modal.Body>
    </Modal>
  );
}


function Display() {
  const [modalShow, setModalShow] = React.useState(false);
  const isSmallScreen = useMediaQuery({ maxWidth: 767 });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('random');
  const [page, setPage] = useState(1);
  const [hoveredPhoto, setHoveredPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likes, setLikes] = useState(() => {
    const storedLikes = localStorage.getItem('likes');
    return storedLikes ? JSON.parse(storedLikes) : {};
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  useEffect(() => {
    setModalShow(true)
  }, []);
  useEffect(() => {
    const fetchPhotos = async () => {
      let url;

      if (sort === 'popular') {
        url = `https://api.pexels.com/v1/curated?per_page=100&page=${page}`;
      } else {
        if (category === 'all') {
          url = `https://api.pexels.com/v1/curated?per_page=10&page=${page}`;
        } else {
          url = `https://api.pexels.com/v1/search?query=${category}&per_page=10&page=${page}`;
        }
      }

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: PexelsApiKey,
          },
        });

        let sortedPhotos;

        if (sort === 'popular') {
          sortedPhotos = response.data.photos.sort((a, b) => likes[b.id] - likes[a.id]);
        } else if (sort === 'new') {
          sortedPhotos = response.data.photos
            .filter((photo) => !likes[photo.id])
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sort === 'networthy') {
          sortedPhotos = response.data.photos.sort((a, b) => (likes[b.id] || 0) - (likes[a.id] || 0));
        } else {
          sortedPhotos = response.data.photos.sort(() => Math.random() - 0.5);
        }

        setPhotos(sortedPhotos.slice(0, 10));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [category, sort, page, likes]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter suggestions based on the entered letters
    const filteredSuggestions = animals
      .filter((animal) => animal.label.toLowerCase().includes(value))
      .slice(0, 4); // Limit suggestions to 4 elements

    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (value) => {
    setSearchTerm(value);
    setSuggestions([]);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
  };

  const handleSearchSubmit = () => {
    setPage(1);
    setCategory(searchTerm);
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleLike = (photoId) => {
    setLikeCounts((prevLikeCounts) => {
      const newLikeCounts = {
        ...prevLikeCounts,
        [photoId]: (prevLikeCounts[photoId] || 0) + 1,
      };
      return newLikeCounts;
    });
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const handleMouseEnter = (photo) => {
    setHoveredPhoto(photo);
  };

  const handleMouseLeave = () => {
    setHoveredPhoto(null);
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  if (error) {
    return <div className="alert alert-warning mt-4 mx-auto" role="alert" style={{ maxWidth: '400px' }}>
      <button
        type="button"
        className="btn btn-clear"
        onClick={() => window.location.reload()}
        aria-label="Close"
        style={{ position: 'absolute', top: '10px', right: '15px', cursor: 'pointer' }}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <h5 className="alert-heading">Oops! Something went wrong 😥</h5>
    </div>

      ;
  }

  return (
    <div className="container ">
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <h1 className="mb-4">Photos by Category</h1>
      <div className="row m-4" id="category">
        <header className="d-flex justify-content-center py-3">
          {isSmallScreen && (
            <Dropdown onSelect={(selectedCategory) => handleCategoryChange(selectedCategory)}>
              <Dropdown.Toggle variant="primary" id="category-dropdown">
                Category
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="all">All</Dropdown.Item>
                <Dropdown.Item eventKey="nature">Nature</Dropdown.Item>
                <Dropdown.Item eventKey="architecture">Architecture</Dropdown.Item>
                <Dropdown.Item eventKey="Technology">Technology</Dropdown.Item>
                <Dropdown.Item eventKey="Motivational">Motivational</Dropdown.Item>
                <Dropdown.Item eventKey="dark">Dark</Dropdown.Item>
                <Dropdown.Item eventKey="Beautiful">Beautiful</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
          {!isSmallScreen && (
            <ul className="nav nav-pills">
              <li className="nav-item"><button className='btn px-3' onClick={() => handleCategoryChange('Popular')}>All</button></li>
              <li className="nav-item"><button className='btn px-3' onClick={() => handleCategoryChange('nature')}>Nature</button></li>
              <li className="nav-item"><button className='btn px-3' onClick={() => handleCategoryChange('architecture')}>Architecture</button></li>
              <li className="nav-item"><button className='btn px-3' onClick={() => handleCategoryChange('Technology')}>Technology</button></li>
              <li className="nav-item"><button className='btn px-3' onClick={() => handleCategoryChange('Motivational')}>Motivational</button></li>
              <li className="nav-item"><button className='btn px-3' onClick={() => handleCategoryChange('dark')}>Dark</button></li>
              <li className="nav-item"><button className='btn px-3' onClick={() => handleCategoryChange('Beautiful')}>Beautiful</button></li>
            </ul>
          )}
        </header>
        <div className="row">
          <div className="col-lg-6">
            <select
              id="category"
              className="form-control mb-4 bg-outline-primary"
              onChange={(e) => {
                if (e.target.value === 'Popular') {
                  handleCategoryChange('Popular');
                } else if (e.target.value === 'New') {
                  handleCategoryChange('New');
                } else if (e.target.value === 'Net Worthy') {
                  handleSortChange('networthy');
                } else if (e.target.value === 'Random') {
                  handleSortChange('random');
                }
              }}
            >
              <option value="all">Filter</option>
              <option value="Popular">Popular</option>
              <option value="New">New</option>
              <option value="Net Worthy">Net Worthy</option>
              <option value="Random">Random</option>
            </select>
          </div>
          <div className="col-lg-6">
            <div className="row">
              <div className="col-lg-8">
                <form className='w-100'>
                  <input
                    type="text"
                    className="form-control form-control-light text-bg-light me-2"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-label="Search"
                  />
                  <button type="reset" onClick={handleClearSearch}>&times;</button>
                </form>
              </div>
              <div className="col-lg-4" id="buttet">
                <button
                  className="btn btn-outline-secondary mb-2"
                  onClick={handleSearchSubmit}
                  type="button"
                >
                  Search
                </button>
              </div>
            </div>
          </div> <div className="row">
            <div className="col-lg-4"></div>
            <div className="col-lg-4">
              {suggestions.length > 0 && (
                <ul className="list-group mt-2">
                  {suggestions.map((animal) => (
                    <li
                      key={animal.value}
                      className="list-group-item suggestion-item"
                      onClick={() => handleSuggestionClick(animal.label)}
                    >
                      {animal.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="col-lg-4"></div>

          </div>
        </div>

      </div>

      {photos.length === 0 ? (
        <div>
          <div className="container mt-5">
            <div className="d-flex align-items-center justify-content-center min-vh-100">
              <h1 className="text-center display-4 font-weight-bold">
                Oops! 🤭 Sorry
                No photos match.
              </h1>
            </div>
          </div>

        </div>
      ) : (<div className="row">
        {
          photos.map((photo) => (
            <div key={photo.id} className="col-md-4 mb-4">
              <div className="card" style={{ position: 'relative' }}>
                <div onMouseEnter={() => handleMouseEnter(photo)} onMouseLeave={handleMouseLeave}>
                  <img
                    onClick={() => handlePhotoClick(photo)}
                    src={photo.src.large2x}
                    alt={photo.photographer}
                    className="card-img-top img-fluid"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  {hoveredPhoto === photo && (
                    <div id="tooltip" onClick={() => handlePhotoClick(photo)}>
                      <p>{photo.photographer}</p>
                    </div>
                  )}
                </div>

                <button
                  id="like"
                  onClick={() => handleLike(photo.id)}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    backdropFilter: 'blur(5px)',
                    borderRadius: '8px',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" id="thumb" fill="currentColor" className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                    <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />
                  </svg>
                  <span id="liketext"> {likeCounts[photo.id]}</span>
                </button>
              </div>
            </div>
          ))}
      </div>)}
      {selectedPhoto && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedPhoto.photographer}</h5>
                <button
                  id="close"
                  type="button"
                  className="close btn"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCloseModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body text-center">
                <img src={selectedPhoto.src.landscape} alt={selectedPhoto.photographer} className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <button className="btn btn-primary mb-5" onClick={handleLoadMore}>
          Load More
        </button>
      </div>
    </div>
  );
}

export default Display;
