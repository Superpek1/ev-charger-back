-- สร้างฐานข้อมูลและกำหนดการตั้งค่าเบื้องต้น
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- โครงสร้างตาราง `users`
CREATE TABLE `users` (
  `id` int NOT NULL,
  `userName` varchar(100) NOT NULL,
  `userEmail` varchar(100) NOT NULL,
  `userPhoneNO` varchar(20) NOT NULL,
  `userPassword` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `idCard` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `dob` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ข้อมูลจำลองตาราง `users`
INSERT INTO `users` (`id`, `userName`, `userEmail`, `userPhoneNO`, `userPassword`, `created_at`, `idCard`, `firstName`, `lastName`, `dob`) VALUES
(6, 'Su', 'Su@gmail.com', '2', '$2b$10$jK166fU5JzIOYe2qRPlkmu.bgeIIDnN9SNPntrFOS8FkQNLCcwuEm', '2026-03-18 00:59:45', '12', 'Su', 'Su', '2026-02-28'),
(7, 'Sa', 'Sa@gmail.com', '2', '$2b$10$pMQurGmm6oV098taAA54EeUuN.3gAoAjKqnPlXd9uwfIV5.0Fw7fW', '2026-03-18 01:20:48', '12', 'Sa', 'Sa', '2026-03-21'),
(8, 'Wa', 'wa@gmail.com', '1', '$2b$10$o2l7oUn3oF4F6WE.8xHByOo1K5SFjkkwsZQIeBYTnTEFHdckhHdVS', '2026-03-23 13:52:17', '12', 'Wa', 'Wa', '2026-02-27');

-- โครงสร้างตาราง `vehicles`
CREATE TABLE `vehicles` (
  `vehicleId` int NOT NULL,
  `userId` int NOT NULL,
  `licensePlate` varchar(50) NOT NULL,
  `model` varchar(100) DEFAULT NULL,
  `chargerType` varchar(50) DEFAULT NULL,
  `batteryCapacity` varchar(50) DEFAULT NULL,
  `src` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ข้อมูลจำลองตาราง `vehicles`
INSERT INTO `vehicles` (`vehicleId`, `userId`, `licensePlate`, `model`, `chargerType`, `batteryCapacity`, `src`) VALUES
(4, 6, '12 a', 'รถ002', 'หัวชาต002', NULL, 'https://static.thairath.co.th/media/B6FtNKtgSqRqbnNsbKGs375v2lFTrI3vKT0cxkhDCmCtH5Jn7elJS0axz0xMWeoqcqfI9.jpg');

-- กำหนด Primary Key และ Foreign Key
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userEmail` (`userEmail`);

ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicleId`),
  ADD KEY `userId` (`userId`);

ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `vehicles`
  MODIFY `vehicleId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;