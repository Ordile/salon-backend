-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 26, 2026 lúc 09:58 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `salon`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `appointment`
--

CREATE TABLE `appointment` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `appointment_date` datetime NOT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `appointment`
--

INSERT INTO `appointment` (`id`, `name`, `phone`, `appointment_date`, `note`) VALUES
(1, 'Bạch Nguyễn Bảo Ân', '0383778712', '2025-10-22 00:04:00', 'eseh');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `app_user`
--

CREATE TABLE `app_user` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `app_user`
--

INSERT INTO `app_user` (`id`, `email`, `password`, `username`, `address`) VALUES
(1, 'an@gmail.com', '$2a$10$BNodKCZjuKhoMc2jE/.iNuCr05pCbj952/oOteapElx4.yzuHXc4.', 'baoan', NULL),
(2, 'an1@gmail.com', '$2a$10$X/lVl5Zt446A03IXK4g2wujWiRnpbUFO5/.N87Po/gJ1.uQoUcCiG', 'an', 'ưetqwt'),
(3, 'admin@salontoro.com', '$2a$10$U5S2t4z67SToZa6rffrJjeQ1KUwMyMAMhbhAL6Pflc10uiWEcV6fO', 'admin', 'q35qr'),
(4, 'anu200@gmail.com', '$2a$10$mP1xw.TkCfS5pBTyirhqCuZudU3DlDFhaPSgz7DxVDLwNrzYwC8tC', 'a', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contact`
--

CREATE TABLE `contact` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `contact`
--

INSERT INTO `contact` (`id`, `name`, `address`, `phone`, `email`, `message`) VALUES
(1, 'Bạch Nguyễn Bảo Ân', 'Tp. Bảo Lộc', '0383778712', 'baoangod2005@gmail.com', 'ẻy');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `payment_method` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `total_amount` double DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  `return_status` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `created_at`, `payment_method`, `status`, `total_amount`, `user_id`, `return_status`, `shipping_address`) VALUES
(11, '2026-03-26 01:08:57.000000', 'BANK', 'RETURNED', 1200000, 3, 'REQUESTED', NULL),
(12, '2026-03-26 01:14:42.000000', 'COD', 'RETURNED', 570000, 2, 'REQUESTED', NULL),
(13, '2026-03-26 01:20:20.000000', 'COD', 'PENDING', 270000, 3, NULL, NULL),
(14, '2026-03-20 01:54:57.000000', 'COD', 'CONFIRMED', 270000, 3, NULL, '441/65 Điện Biên Phủ, P.25, Bình Thạnh, TP.HCM'),
(16, '2026-03-23 01:54:58.000000', 'COD', 'RETURNED', 570000, 3, 'REQUESTED', '441/65 Điện Biên Phủ, P.25, Bình Thạnh, TP.HCM');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL,
  `price` double DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `price`, `quantity`, `order_id`, `product_id`) VALUES
(11, 300000, 4, 11, 15),
(12, 270000, 1, 12, 12),
(14, 270000, 1, 13, 12),
(15, 270000, 1, 14, 12),
(18, 300000, 1, 16, 15);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`id`, `description`, `image_url`, `name`, `price`) VALUES
(12, 'Dành cho tóc khô xơ', 'https://salontocvip.com/upload/product/tinh-dau-duong-toc-moroccanoil-treatment-original-25ml-7199_270x250.jpg', 'Dầu gội cao cấp', 270000),
(15, 'Cặp gội xả Nashi Argan Conditioner, tinh dầu dưỡng tóc phục hồi hư tổn 500ml của ý cho bạn mái tóc bóng, mềm mại ngay lần đầu sử dụng', 'https://salontocvip.com/upload/product/cap-goi-xa-nashi-argan-conditioner-phuc-hoi-toc-hu-ton-6413_270x250.jpg', 'Cặp gội xả Nashi Argan Conditioner, phục hồi tóc hư tổn', 300000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `role`
--

CREATE TABLE `role` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'USER'),
(2, 'ADMIN');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `service`
--

CREATE TABLE `service` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('USER','ADMIN') DEFAULT 'USER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `app_user`
--
ALTER TABLE `app_user`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKl7je3auqyq1raj52qmwrgih8x` (`product_id`),
  ADD KEY `FK1n4av86bhx6a2ow6lkdb8ow16` (`user_id`);

--
-- Chỉ mục cho bảng `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKosotb7rvgk4myda45ki0cf9j` (`user_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  ADD KEY `FKlf6f9q956mt144wiv6p1yko16` (`product_id`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Chỉ mục cho bảng `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `FKrhfovtciq1l558cw6udg0h0d3` (`role_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `appointment`
--
ALTER TABLE `appointment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `app_user`
--
ALTER TABLE `app_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `contact`
--
ALTER TABLE `contact`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `role`
--
ALTER TABLE `role`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `service`
--
ALTER TABLE `service`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `FK1n4av86bhx6a2ow6lkdb8ow16` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`),
  ADD CONSTRAINT `FKl7je3auqyq1raj52qmwrgih8x` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FKosotb7rvgk4myda45ki0cf9j` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `FKlf6f9q956mt144wiv6p1yko16` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Các ràng buộc cho bảng `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `FK6fql8djp64yp4q9b3qeyhr82b` FOREIGN KEY (`user_id`) REFERENCES `app_user` (`id`),
  ADD CONSTRAINT `FKrhfovtciq1l558cw6udg0h0d3` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
