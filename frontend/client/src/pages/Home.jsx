// import React, { useState } from "react";
// import Carousel from "react-bootstrap/Carousel";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
// import { assets } from "../assets/assets";

// // ExampleCarouselImage component (replace with your actual image component)
// const ExampleCarouselImage = ({ text }) => {
//   return (
//     <div
//       style={{
//         height: "400px",
//         backgroundColor: "#777",
//         color: "white",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       {text}
//     </div>
//   );
// };

// // ControlledCarousel component
// const ControlledCarousel = () => {
//   const [index, setIndex] = useState(0);

//   const handleSelect = (selectedIndex) => {
//     setIndex(selectedIndex);
//   };

//   return (
//     <Carousel activeIndex={index} onSelect={handleSelect}>
//       <Carousel.Item>
//         <ExampleCarouselImage text="First slide" />
//         <Carousel.Caption>
//           <div
//             style={{
//               backgroundImage: `url(${assets.front})`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               backgroundRepeat: "no-repeat",
//               height: "150vh", // Adjust the height as needed
//               width: "150%",
//             }}
//           ></div>
//           <h3>Room fesilities</h3>
//           <p>In the room we will be getting all the fecilities.</p>
//         </Carousel.Caption>
//       </Carousel.Item>
//       <Carousel.Item>
//         <ExampleCarouselImage text="Second slide" />
//         <Carousel.Caption>
//           <div
//             style={{
//               backgroundImage: `url(${assets.ho})`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               backgroundRepeat: "no-repeat",
//               height: "150vh", // Adjust the height as needed
//               width: "150%",
//             }}
//           ></div>
//           <h3>Second slide label</h3>
//           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
//         </Carousel.Caption>
//       </Carousel.Item>
//       <Carousel.Item>
//         <ExampleCarouselImage text="Third slide" />
//         <Carousel.Caption>
//           <div
//             style={{
//               backgroundImage: `url(${assets.h2})`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               backgroundRepeat: "no-repeat",
//               height: "150vh", // Adjust the height as needed
//               width: "150%",
//             }}
//           ></div>
//           <h3>Third slide label</h3>
//           <p>
//             Praesent commodo cursus magna, vel scelerisque nisl consectetur.
//           </p>
//         </Carousel.Caption>
//       </Carousel.Item>
//       <Carousel.Item>
//         <ExampleCarouselImage text="Third slide" />
//         <Carousel.Caption>
//           <div
//             style={{
//               backgroundImage: `url(${assets.home1})`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               backgroundRepeat: "no-repeat",
//               height: "150vh", // Adjust the height as needed
//               width: "150%",
//             }}
//           ></div>
//           <h3>Third slide label</h3>
//           <p>
//             Praesent commodo cursus magna, vel scelerisque nisl consectetur.
//           </p>
//         </Carousel.Caption>
//       </Carousel.Item>
//     </Carousel>
//   );
// };

// // Home component
// const Home = () => {
//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//         <div className="container-fluid">
//           {/* Brand/Logo */}
//           <a
//             className="navbar-brand bold"
//             href="/"
//             style={{
//               fontSize: "2rem",
//               fontWeight: "bold",
//               whiteSpace: "nowrap",
//             }}
//           >
//             JDG Hostel Management System
//           </a>

//           {/* Toggle Button for Mobile */}
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//             aria-controls="navbarNav"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           {/* Navbar Links */}
//           <div className="collapse navbar-collapse" id="navbarNav">
//             {/* Push the links to the right */}
//             <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
//               <li className="nav-item">
//                 <a className="nav-link active" aria-current="page" href="/">
//                   Home
//                 </a>
//               </li>
//               <li className="nav-item">
//                 <a className="nav-link active" href="/admission">
//                   Admission
//                 </a>
//               </li>
//             </ul>

//             {/* Login Button */}
//             <button
//               className="btn btn-outline-light ms-2"
//               type="button"
//               onClick={() => (window.location.href = "/login")}
//             >
//               Login
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Marquee */}
//       <marquee
//         behavior="scroll"
//         direction="left"
//         className="text-lg font-semibold text-black bg-blue-600 py-2"
//       >
//         Welcome to JDG Hostel Management System - Managed by George. Last Date
//         to apply on 30/05/2025
//         <a href="/admission" className="text-green-500 underline ml-2">
//           Hostel Admission Opened!
//           {/* <img
//             src={assets.boom1} // Replace with your actual image path
//             alt="Boom Icon"
//             className="inline-block h-8 ml-2"
//           /> */}
//         </a>
//       </marquee>

//       {/* Carousel */}
//       <ControlledCarousel />
//     </div>
//   );
// };

// export default Home;
import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import { assets } from "../assets/assets";

// Carousel Image Component
const CarouselImage = ({ image, text }) => {
  return (
    <div
      style={{
        height: "500px", // Adjusted height
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "black", // Changed text color to black
        fontSize: "2rem",
        fontWeight: "bold",
      }}
    >
      {text}
    </div>
  );
};

// Controlled Carousel Component
const ControlledCarousel = () => {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} interval={3000}>
      <Carousel.Item>
        <CarouselImage image={assets.front} text="JDG Hostel " />
        <Carousel.Caption>
          <h3>Room Facilities</h3>
          <p>Experience top-notch facilities in our hostel rooms.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <CarouselImage image={assets.ho} text="Comfort & Security" />
        <Carousel.Caption>
          <h3>Comfort & Security</h3>
          <p>Your safety and comfort are our top priorities.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <CarouselImage image={assets.h2} text="Spacious Living" />
        <Carousel.Caption>
          <h3>Spacious Living</h3>
          <p>Enjoy a clean and well-maintained living space.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

// Home Component
const Home = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="/">
            JDG Hostel Management System
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admission">
                  Admission
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/interview">
                  Interview
                </a>
              </li>
            </ul>
            <button
              className="btn btn-outline-light ms-3"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Marquee */}
      <marquee className="bg-warning py-2 text-dark fw-semibold">
        Welcome to JDG Hostel Management System - Managed by Georgebush.Xavier
        and JDG Hostel Team . Last date to apply: 30/05/2025
        <a href="/admission" className="text-primary fw-bold ms-2">
          Hostel Admission Open Now!
        </a>
      </marquee>

      {/* Carousel */}
      <ControlledCarousel />
    </div>
  );
};

export default Home;
