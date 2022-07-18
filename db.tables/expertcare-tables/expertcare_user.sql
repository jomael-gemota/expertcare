-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: mapwatcher-rds.crhcghnub9gg.us-east-1.rds.amazonaws.com    Database: expertcare
-- ------------------------------------------------------
-- Server version	5.6.51-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (5,'Guest','guest','81dc9bdb52d04dc20036dbd8313ed055','Active'),(6,'a','a','0cc175b9c0f1b6a831c399e269772661','Active'),(8,'Philip','philip01','827ccb0eea8a706c4c34a16891f84e7b','Active'),(9,'Jomael Gemota','jomael','$2b$10$LER17TwYmATxTDiNzfHPYui5QMA4MNeiNku3XhuxloAMWzCz9BNsC','Active'),(10,'Admin','admin','$2b$10$9BfTGtddicsgMmPdlU2EL.I3P98GqndMa9YUZlaUSqQESK0fs2yqu','Active'),(11,'Jomael Gemota','jgemota','$2b$10$fh/69SxfvqIfoarR66XJm.vqeissOH2C4aAmNbJccRvbSKZwt3.2e','Active'),(22,'Jomael Gemota','jgemot','$2b$10$5Zi76ZbvElzpxT04NrVnGO/XfmOKfe7r.qWtIkzsjsIosbAx2dVay','Active'),(23,'Jomael Gemota','mael','$2b$10$shPK/g88OKmyZ7LO9hYo5exbTdpg19jXl.4UCDhA4DX0vwY8kFUkq','Active'),(34,'Staff','staff','$2b$10$nRnhNI7L9/CB3I1wswZ1q.QXyM5ObFdGz6Hr5SqbxLYOCwzeFzXYG','Active'),(36,'Philip Bascar','philip','$2b$10$ZVpAplpkc3.6H3pkg1PvlOcFfjeUMDLxwJqg7SXDfZD4bVXQi0BIO','Active'),(37,'QA User 1','qa-user-1','$2b$10$2XOszc40TJNc7uva1YXJvO8PoWd2ZpWFuezyJWqOtdP0FNeyzBiSy','Active');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-18 22:03:44
