-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 08, 2022 at 03:19 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shop_inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customerID` int(11) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `illness` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(11) DEFAULT NULL,
  `phone2` varchar(11) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(30) DEFAULT NULL,
  `district` varchar(30) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customerID`, `fullName`, `illness`, `email`, `mobile`, `phone2`, `address`, `city`, `district`, `status`, `createdOn`) VALUES
(1, 'Bascar, Philip Vincent Suarez', 'Headache', 'bascar@gmail.com', '09202297927', '0', 'Bankal', 'Lapu Lapu', 'Cebu', 'Active', '2021-10-20 09:44:26'),
(2, 'Dela Cruz, John Lloyd Pimentel', 'Headache', '', '09123456789', '0', 'Basak', 'Lapu Lapu City', 'Cebu', 'Active', '2022-01-11 06:32:19'),
(4, 'Judy Ann Inot', 'Headache', '', '', '0', 'Tudtud, Nasipit Road, Talamban', '', 'Carcar', 'Active', '2022-02-03 16:39:10'),
(5, 'Christian Misa', 'Headache', NULL, '09168771535', '2147483647', 'Tudtud, Nasipit', NULL, 'Carcar', 'Active', '2022-02-03 16:42:36'),
(6, 'Mary Miles Misa', 'Headache', NULL, NULL, '2147483647', 'Nasipit Road', NULL, 'Carcar', 'Active', '2022-02-03 16:43:26'),
(7, 'John Eric Genandoy', 'Headache', 'eric@gmail.com', '09168771535', '09168771535', 'Lomboy, Napo', 'Cebu City', 'Carcar', 'Active', '2022-02-03 16:44:44');

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `productID` int(11) NOT NULL,
  `itemNumber` varchar(255) NOT NULL,
  `itemName` varchar(255) NOT NULL,
  `units` varchar(255) NOT NULL,
  `discount` float NOT NULL DEFAULT 0,
  `stock` int(11) NOT NULL DEFAULT 0,
  `unitPrice` float NOT NULL DEFAULT 0,
  `imageURL` varchar(255) NOT NULL DEFAULT 'imageNotAvailable.jpg',
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`productID`, `itemNumber`, `itemName`, `units`, `discount`, `stock`, `unitPrice`, `imageURL`, `status`, `description`) VALUES
(25, 'BIO500MG', 'Biogesic', '250 mg', 0, 100, 11, 'imageNotAvailable.jpg', 'Active', 'Best for headaches only.'),
(26, 'NEO500G', 'Neozep', '500 g', 0, 36, 8, 'imageNotAvailable.jpg', 'Active', ''),
(30, 'SOL500MG', 'Solmux', '500 mg', 0, 47, 12, 'imageNotAvailable.jpg', 'Active', 'For cough medicine.'),
(32, 'MEF500MG', 'Mefenamic', '500 mg', 0, 45, 8, 'imageNotAvailable.jpg', 'Active', 'For toothache.');

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

CREATE TABLE `purchase` (
  `purchaseID` int(11) NOT NULL,
  `itemNumber` varchar(255) NOT NULL,
  `itemName` varchar(255) NOT NULL,
  `unitPrice` float NOT NULL DEFAULT 0,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `vendorName` varchar(255) NOT NULL,
  `vendorID` int(11) NOT NULL DEFAULT 0,
  `purchaseDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `purchase`
--

INSERT INTO `purchase` (`purchaseID`, `itemNumber`, `itemName`, `unitPrice`, `quantity`, `vendorName`, `vendorID`, `purchaseDate`) VALUES
(19, 'BIO250MG', 'Biogesic', 2, 10, 'Astrazeneca', 5, '2022-02-10'),
(21, 'BIO500MG', 'Biogesic', 8, 2, 'Pfizer', 4, '2022-02-04');

-- --------------------------------------------------------

--
-- Table structure for table `sale`
--

CREATE TABLE `sale` (
  `saleID` int(11) NOT NULL,
  `itemNumber` varchar(255) NOT NULL,
  `customerID` int(11) NOT NULL,
  `customerName` varchar(255) NOT NULL,
  `itemName` varchar(255) NOT NULL,
  `saleDate` date NOT NULL,
  `discount` float NOT NULL DEFAULT 0,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `unitPrice` float NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sale`
--

INSERT INTO `sale` (`saleID`, `itemNumber`, `customerID`, `customerName`, `itemName`, `saleDate`, `discount`, `quantity`, `unitPrice`) VALUES
(25, '1', 0, 'Bascar, Philip Vincent Suarez', 'Test Item Name', '2022-01-28', 0, 2, 10),
(26, '2', 0, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-28', 0, 1, 5),
(27, '1', 0, 'Bascar, Philip Vincent Suarez', 'Test Item Name', '2022-01-28', 0, 1, 10),
(28, '2', 0, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-28', 0, 1, 5),
(29, '1', 0, 'Dela Cruz, John Lloyd Pimentel', 'Test Item Name', '2022-01-27', 0, 3, 10),
(30, '1', 0, 'Dela Cruz, John Lloyd Pimentel', 'Saridon', '2022-01-27', 0, 100, 10),
(31, '2', 0, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-28', 0, 2, 5),
(32, '2', 0, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-28', 0, 1, 5),
(33, '3', 0, 'Bascar, Philip Vincent Suarez', 'Biogesic', '0000-00-00', 0, 3, 5),
(34, '3', 0, 'Dela Cruz, John Lloyd Pimentel', 'Biogesic', '0000-00-00', 0, 2, 5),
(35, 'SOL001', 0, 'Dela Cruz, John Lloyd Pimentel', 'SOLMUX', '0000-00-00', 0, 1, 6),
(36, '1', 0, 'Dela Cruz, John Lloyd Pimentel', 'Test Item Name', '0000-00-00', 0, 1, 10),
(37, '3', 0, 'Dela Cruz, John Lloyd Pimentel', 'Biogesic', '0000-00-00', 0, 1, 5),
(38, '2', 0, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '0000-00-00', 0, 1, 5),
(39, '2', 0, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '0000-00-00', 0, 2, 5),
(40, '2', 0, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '0000-00-00', 0, 2, 5),
(41, '2', 0, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '0000-00-00', 0, 1, 5),
(42, '3', 0, 'Bascar, Philip Vincent Suarez', 'Biogesic', '0000-00-00', 0, 1, 5),
(43, '1', 0, 'Bascar, Philip Vincent Suarez', 'Test Item Name', '0000-00-00', 0, 2, 10),
(44, '2', 0, 'Bascar, Philip Vincent Suarez', 'Rexidol', '0000-00-00', 0, 2, 5),
(45, '2', 0, 'Bascar, Philip Vincent Suarez', 'Rexidol', '0000-00-00', 0, 1, 5),
(46, '2', 0, 'Bascar, Philip Vincent Suarez', 'Rexidol', '0000-00-00', 0, 2, 5),
(47, '2', 0, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '0000-00-00', 0, 2, 5),
(48, '3', 0, 'Dela Cruz, John Lloyd Pimentel', 'Biogesic', '0000-00-00', 3, 2, 5),
(49, '2', 0, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '0000-00-00', 0, 2, 5),
(50, '1', 0, 'Dela Cruz, John Lloyd Pimentel', 'Test Item Name', '0000-00-00', 1, 1, 10),
(51, '2', 0, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '0000-00-00', 2, 2, 5),
(52, '1', 0, 'Bascar, Philip Vincent Suarez', 'Test Item Name', '2022-01-28', 3, 2, 10),
(53, '2', 0, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-28', 0, 2, 5),
(54, '3', 1, 'Bascar, Philip Vincent Suarez', 'Biogesic', '2022-01-28', 0, 2, 5),
(55, 'AMOX500MG', 2, 'Dela Cruz, John Lloyd Pimentel', 'Amoxicillin', '2022-01-28', 0, 1, 8),
(56, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-28', 0, 1, 5),
(57, '3', 1, 'Bascar, Philip Vincent Suarez', 'Biogesic', '2022-01-29', 0, 3, 5),
(58, '3', 1, 'Bascar, Philip Vincent Suarez', 'Biogesic', '2022-01-29', 0, 1, 5),
(59, '3', 1, 'Bascar, Philip Vincent Suarez', 'Biogesic', '2022-01-29', 0, 1, 5.5),
(60, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 5, 5),
(61, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 5, 5),
(62, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 3, 5),
(63, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 3, 5),
(64, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 3, 5),
(65, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 2, 5),
(66, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 3, 5),
(67, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 3, 5),
(68, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 3, 5),
(69, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 2, 5),
(71, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 2, 5),
(72, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 2, 5),
(73, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 2, 5),
(74, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 2, 5),
(75, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 1, 5),
(76, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 2, 5),
(77, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 2, 5),
(78, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 2, 5),
(79, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 2, 5),
(80, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 2, 5),
(81, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 2, 5),
(82, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 2, 5),
(83, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 2, 5),
(84, '3', 2, 'Dela Cruz, John Lloyd Pimentel', 'Biogesic', '2022-01-30', 0, 3, 5.5),
(85, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 2, 5),
(86, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-30', 0, 2, 5),
(87, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 2, 5),
(88, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 2, 5),
(89, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 2, 5),
(90, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-30', 0, 2, 5),
(91, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(92, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(93, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(94, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(95, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(96, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(97, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(98, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(99, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 1, 5),
(100, '1', 1, 'Bascar, Philip Vincent Suarez', 'Test Item Name', '2022-01-31', 0, 2, 10),
(101, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 5, 5),
(102, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(103, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(104, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(105, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(106, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 3, 5),
(107, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-31', 0, 2, 5),
(108, '1', 1, 'Bascar, Philip Vincent Suarez', 'Test Item Name', '2022-01-31', 0, 2, 10),
(109, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-31', 0, 2, 5),
(110, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-31', 0, 2, 5),
(111, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-31', 0, 2, 5),
(112, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(113, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(114, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(115, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(116, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(117, '3', 1, 'Bascar, Philip Vincent Suarez', 'Biogesic', '2022-01-31', 0, 3, 5.5),
(118, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(119, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(120, '3', 1, 'Bascar, Philip Vincent Suarez', 'Biogesic', '2022-01-31', 0, 3, 5.5),
(121, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(122, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(123, '3', 1, 'Bascar, Philip Vincent Suarez', 'Biogesic', '2022-01-31', 0, 2, 5.5),
(124, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(125, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(126, 'SOL001', 2, 'Dela Cruz, John Lloyd Pimentel', 'SOLMUX', '2022-01-31', 0, 10, 6),
(127, '3', 2, 'Dela Cruz, John Lloyd Pimentel', 'Biogesic', '2022-01-31', 0, 3, 5.5),
(128, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(129, 'SOL001', 1, 'Bascar, Philip Vincent Suarez', 'SOLMUX', '2022-01-31', 0, 3, 6),
(130, 'SOL001', 1, 'Bascar, Philip Vincent Suarez', 'SOLMUX', '2022-01-31', 0, 2, 6),
(131, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(132, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(133, '3', 1, 'Bascar, Philip Vincent Suarez', 'Biogesic', '2022-01-31', 0, 3, 5.5),
(134, '3', 2, 'Dela Cruz, John Lloyd Pimentel', 'Biogesic', '2022-01-31', 0, 2, 5.5),
(135, '1', 2, 'Dela Cruz, John Lloyd Pimentel', 'Test Item Name', '2022-01-31', 0, 2, 10),
(136, '3', 1, 'Bascar, Philip Vincent Suarez', 'Biogesic', '2022-01-31', 0, 4, 5.5),
(137, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 10, 5),
(138, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 5, 5),
(139, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 15, 5),
(140, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(141, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 5, 5),
(142, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 3, 5),
(143, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 2, 5),
(144, '2', 1, 'Bascar, Philip Vincent Suarez', 'Rexidol', '2022-01-31', 0, 4, 5),
(145, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-31', 0, 2, 5),
(146, '2', 2, 'Dela Cruz, John Lloyd Pimentel', 'Rexidol', '2022-01-31', 0, 2, 5),
(149, 'AMOX500MG', 1, 'Bascar, Philip Vincent Suarez', 'Amoxicillin', '2022-02-01', 0, 4, 8),
(150, 'AMOX500MG', 1, 'Bascar, Philip Vincent Suarez', 'Amoxicillin', '2022-02-01', 0, 3, 8),
(151, 'AMOX500MG', 1, 'Bascar, Philip Vincent Suarez', 'Amoxicillin', '2022-02-01', 0, 3, 8),
(154, 'AMOX500MG', 1, 'Bascar, Philip Vincent Suarez', 'Amoxicillin', '2022-02-01', 0, 2, 8),
(155, 'NEO500G', 2, 'Dela Cruz, John Lloyd Pimentel', 'Neozep', '2022-02-01', 0, 5, 8),
(156, 'AMOX500MG', 1, 'Bascar, Philip Vincent Suarez', 'Amoxicillin', '2022-02-01', 0, 1, 8),
(157, 'AMOX500MG', 1, 'Bascar, Philip Vincent Suarez', 'Amoxicillin', '2022-02-01', 0, 2, 8),
(158, 'AMOX500MG', 1, 'Bascar, Philip Vincent Suarez', 'Amoxicillin', '2022-02-02', 0, 2, 8),
(159, 'SOL500MG', 2, 'Dela Cruz, John Lloyd Pimentel', 'Solmux', '2022-02-02', 0, 2, 12),
(160, 'AMOX500MG', 1, 'Bascar, Philip Vincent Suarez', 'Amoxicillin', '2022-02-02', 0, 3, 8),
(161, 'AMOX500MG', 1, 'Bascar, Philip Vincent Suarez', 'Amoxicillin', '2022-02-02', 0, 3, 8),
(162, 'AMOX500MG', 1, 'Bascar, Philip Vincent Suarez', 'Amoxicillin', '2022-02-02', 0, 2, 8),
(163, 'BIO500MG', 1, 'Bascar, Philip Vincent Suarez', 'Biogesic', '2022-02-04', 0, 5, 10),
(164, 'NEO500G', 1, 'Bascar, Philip Vincent Suarez', 'Neozep', '2022-02-04', 0, 2, 8),
(165, 'BIO500MG', 1, 'Bascar, Philip Vincent Suarez', 'Biogesic', '2022-02-04', 0, 5, 10),
(166, 'NEO500G', 1, 'Bascar, Philip Vincent Suarez', 'Neozep', '2022-02-04', 0, 2, 8),
(167, 'SOL500MG', 1, 'Bascar, Philip Vincent Suarez', 'Solmux', '2022-02-04', 0, 1, 12),
(168, 'BIO500MG', 6, 'Mary Miles Misa', 'Biogesic', '2022-02-04', 0, 40, 10);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `fullName`, `username`, `password`, `status`) VALUES
(5, 'Guest', 'guest', '81dc9bdb52d04dc20036dbd8313ed055', 'Active'),
(6, 'a', 'a', '0cc175b9c0f1b6a831c399e269772661', 'Active'),
(8, 'Philip', 'philip01', '827ccb0eea8a706c4c34a16891f84e7b', 'Active'),
(9, 'Jomael Gemota', 'jomael', '$2b$10$TItyvRMK8IIT0NYcRVxBUelc0zec19TywWo7HZ5U.y.4zPal1u1Dm', 'Active'),
(10, 'Admin', 'admin', '$2b$10$9BfTGtddicsgMmPdlU2EL.I3P98GqndMa9YUZlaUSqQESK0fs2yqu', 'Active'),
(11, 'Jomael Gemota', 'jgemota', '$2b$10$fh/69SxfvqIfoarR66XJm.vqeissOH2C4aAmNbJccRvbSKZwt3.2e', 'Active'),
(22, 'Jomael Gemota', 'jgemot', '$2b$10$5Zi76ZbvElzpxT04NrVnGO/XfmOKfe7r.qWtIkzsjsIosbAx2dVay', 'Active'),
(23, 'Jomael Gemota', 'mael', '$2b$10$shPK/g88OKmyZ7LO9hYo5exbTdpg19jXl.4UCDhA4DX0vwY8kFUkq', 'Active'),
(34, 'Staff', 'staff', '$2b$10$nRnhNI7L9/CB3I1wswZ1q.QXyM5ObFdGz6Hr5SqbxLYOCwzeFzXYG', 'Active'),
(36, 'Philip Bascar', 'philip', '$2b$10$ZVpAplpkc3.6H3pkg1PvlOcFfjeUMDLxwJqg7SXDfZD4bVXQi0BIO', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `vendor`
--

CREATE TABLE `vendor` (
  `vendorID` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(11) DEFAULT NULL,
  `phone2` varchar(11) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `city` varchar(30) DEFAULT NULL,
  `district` varchar(30) NOT NULL,
  `status` varchar(255) DEFAULT 'Active',
  `createdOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vendor`
--

INSERT INTO `vendor` (`vendorID`, `fullName`, `email`, `mobile`, `phone2`, `address`, `address2`, `city`, `district`, `status`, `createdOn`) VALUES
(4, 'Pfizer', 'pfizer@gmail.com', '09168771535', '09168771535', 'Nasipit Talamban', NULL, '', 'Cebu', 'Active', '2022-02-02 17:14:27'),
(5, 'Astrazeneca', 'astrazeneca@gmail.com', '09168771535', '0', 'Banilad', NULL, 'Cebu City', 'Cebu', 'Active', '2022-02-02 17:19:16'),
(7, 'Sinovac', 'sinovac@gmail.com', '09168771535', '0', 'Banilad', NULL, 'Cebu City', 'Cebu', 'Active', '2022-02-02 17:20:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customerID`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`productID`),
  ADD UNIQUE KEY `itemName` (`itemName`);

--
-- Indexes for table `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`purchaseID`);

--
-- Indexes for table `sale`
--
ALTER TABLE `sale`
  ADD PRIMARY KEY (`saleID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `vendor`
--
ALTER TABLE `vendor`
  ADD PRIMARY KEY (`vendorID`),
  ADD UNIQUE KEY `fullName` (`fullName`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `productID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `purchase`
--
ALTER TABLE `purchase`
  MODIFY `purchaseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `sale`
--
ALTER TABLE `sale`
  MODIFY `saleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `vendor`
--
ALTER TABLE `vendor`
  MODIFY `vendorID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
