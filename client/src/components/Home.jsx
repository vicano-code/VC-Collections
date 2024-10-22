import React from "react";
import Products from "./Products";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import femaledesigns from "../img/new_designs1.webp";
import casuals from "../img/casuals.jpg";
import collections from "../img/collections.jpg";
import mencasuals from "../img/smart-casual-attire-men.jpg";
import maxresdefault from "../img/maxresdefault.jpg";

const Home = () => {
  return (
    <>
      <div className="advert mb-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          className="mySwiper"
          effect={"coverflow"}
          autoplay={true}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <img src={femaledesigns} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={casuals} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={collections} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={mencasuals} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={maxresdefault} alt="" />
          </SwiperSlide>
        </Swiper>
      </div>
      <Products />
    </>
  );
};

export default Home;