-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 20, 2025 at 03:12 AM
-- Server version: 8.0.41-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moreview`
--

-- --------------------------------------------------------

--
-- Table structure for table `Cast`
--

CREATE TABLE `Cast` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Cast`
--

INSERT INTO `Cast` (`id`, `name`, `photo`, `created_at`, `updated_at`, `createdBy`) VALUES
('32b4fe99-61cf-4c31-a481-4601fdbfa916', 'Angus Sampson', '/uploads/casts/1e96d53c-6f41-47fd-9a0a-880b995d0749.jpg', '2025-03-19 04:28:01.261', '2025-03-19 04:28:01.261', '0a2b4053-270c-4de0-b7e3-62fc736cf052'),
('c54e0285-612f-4dc5-873a-2f363d7a5763', 'Manuel Garcia-Rulfo', '/uploads/casts/cdbfd232-a468-409c-9d04-a39320437923.jpg', '2025-03-19 04:26:21.423', '2025-03-19 04:26:21.423', '0a2b4053-270c-4de0-b7e3-62fc736cf052'),
('d7921ac1-6fd0-48b7-87ca-1429724ce58d', 'Becki Newton', '/uploads/casts/840f10dd-d3d4-490d-9073-ec2b1ccc63db.jpg', '2025-03-19 04:27:24.743', '2025-03-19 04:27:24.743', '0a2b4053-270c-4de0-b7e3-62fc736cf052');

-- --------------------------------------------------------

--
-- Table structure for table `Comment`
--

CREATE TABLE `Comment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `film_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL,
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Comment`
--

INSERT INTO `Comment` (`id`, `comment`, `rating`, `user_id`, `film_id`, `created_at`, `updated_at`) VALUES
('6a4b7909-0dda-4e64-8bec-fcea16fcd9d2', 'Whaaaatt??', 5, '4e52c67c-8974-4bdd-9ec9-da572d1a25c3', '0771bc92-1ec4-4419-9afd-eb5e4ad2ba93', '2025-03-19 06:31:50.776', '2025-03-19 06:31:50.776'),
('8790508c-7b03-47ae-9599-2239109bee98', 'Heyyooo!', 4, '64a29441-ef47-4a49-8300-7ebdf903e1c2', '487aaa04-d9e4-436b-91e3-4d347fb75c42', '2025-03-20 02:08:27.487', '2025-03-20 02:08:27.487'),
('aac1c31c-e5ef-4e0a-9e6e-2b521305860c', '', 3, '0a2b4053-270c-4de0-b7e3-62fc736cf052', '38c63cef-2f20-4baf-9efa-60f3f78ce7a9', '2025-03-19 22:20:28.609', '2025-03-19 22:21:22.347'),
('ee31dc15-d9ef-48ed-a9b9-5dc9b9691017', 'Moreeee please!', 5, '0a2b4053-270c-4de0-b7e3-62fc736cf052', '96a98134-520d-4bc0-a2a6-c8a2b5c9e8aa', '2025-03-19 22:21:47.188', '2025-03-20 00:49:57.699'),
('f3f0d7c7-205f-4e00-a8b8-68b27bd41a5d', 'Cool bro', 1, '0a2b4053-270c-4de0-b7e3-62fc736cf052', '0771bc92-1ec4-4419-9afd-eb5e4ad2ba93', '2025-03-19 05:41:10.338', '2025-03-19 22:39:57.909');

-- --------------------------------------------------------

--
-- Table structure for table `Film`
--

CREATE TABLE `Film` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `poster` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeMov` enum('movie','series') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'movie',
  `duration` int DEFAULT NULL,
  `episode` int DEFAULT NULL,
  `rating` enum('G','PG','PG13','R','NC17','TVY','TVY7','TVG','TVPG','TV14','TVMA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `watchlist` int DEFAULT NULL,
  `creator` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trailer` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trailerUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postedBy` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `archived_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL,
  `updated_at` datetime(3) NOT NULL,
  `release_year` int NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Film`
--

INSERT INTO `Film` (`id`, `title`, `poster`, `typeMov`, `duration`, `episode`, `rating`, `watchlist`, `creator`, `trailer`, `trailerUrl`, `postedBy`, `archived_at`, `created_at`, `updated_at`, `release_year`, `description`) VALUES
('0771bc92-1ec4-4419-9afd-eb5e4ad2ba93', 'Top Gun: Maverick', '/uploads/posters/798b70c5-7bc9-40c3-b95e-16fd28509168.jpg', 'movie', 131, NULL, 'PG13', NULL, 'Joseph Kosinski', NULL, 'https://www.youtube.com/embed/giXco2jaZ_4?si=RTKhdgTuqWUJ9clM', '0a2b4053-270c-4de0-b7e3-62fc736cf052', NULL, '2025-03-19 04:07:41.688', '2025-03-19 04:23:17.062', 2022, 'After more than thirty years of service as one of the Navy’s top aviators, and dodging the advancement in rank that would ground him, Pete “Maverick” Mitchell finds himself training a detachment of TOP GUN graduates for a specialized mission the likes of which no living pilot has ever seen.'),
('38c63cef-2f20-4baf-9efa-60f3f78ce7a9', 'Parasite', '/uploads/posters/cb66f954-9eca-4056-a1ad-5fc41d435a08.jpg', 'movie', 133, NULL, 'R', NULL, 'Bong Joon Ho, Han Jin-won', '/uploads/trailers/f0e443dd-d232-4e7e-a20c-1e5e4862ce9c.mp4', '', '0a2b4053-270c-4de0-b7e3-62fc736cf052', NULL, '2025-03-19 04:02:21.161', '2025-03-19 04:24:49.957', 2019, 'All unemployed, Ki-taek\'s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.'),
('487aaa04-d9e4-436b-91e3-4d347fb75c42', 'Abbott Elementary', '/uploads/posters/8f1b8db6-c0e8-4b8d-8898-d52346d25324.jpg', 'series', NULL, 70, 'TVPG', NULL, 'Quinta Brunson', NULL, 'https://www.youtube.com/embed/l4lP8roLz3I', '64a29441-ef47-4a49-8300-7ebdf903e1c2', NULL, '2025-03-20 01:20:39.803', '2025-03-20 01:21:52.039', 2021, 'In this workplace comedy, a group of dedicated, passionate teachers — and a slightly tone-deaf principal — are brought together in a Philadelphia public school where, despite the odds stacked against them, they are determined to help their students succeed in life. Though these incredible public servants may be outnumbered and underfunded, they love what they do — even if they don’t love the school district’s less-than-stellar attitude toward educating children.'),
('96a98134-520d-4bc0-a2a6-c8a2b5c9e8aa', 'The Lincoln Lawyer', '/uploads/posters/16713e2a-f273-483d-996f-1c4311fef58e.jpg', 'series', NULL, 30, 'TVMA', NULL, 'David E. Kelley', NULL, 'https://www.youtube.com/embed/u-sLh8-ohzc?si=Qx9131i7Ga9prpS1', '0a2b4053-270c-4de0-b7e3-62fc736cf052', NULL, '2025-03-19 04:12:53.008', '2025-03-19 04:25:34.791', 2022, 'Sidelined after an accident, hotshot Los Angeles lawyer Mickey Haller restarts his career - and his trademark Lincoln - when he takes on a murder case.');

-- --------------------------------------------------------

--
-- Table structure for table `FilmCast`
--

CREATE TABLE `FilmCast` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `film_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cast_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `character_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `FilmCast`
--

INSERT INTO `FilmCast` (`id`, `film_id`, `cast_id`, `character_name`, `created_at`, `updated_at`, `createdBy`) VALUES
('6e40db67-5a32-4d22-85dc-973be7ebcbf7', '96a98134-520d-4bc0-a2a6-c8a2b5c9e8aa', 'd7921ac1-6fd0-48b7-87ca-1429724ce58d', 'Lorna Crane', '2025-03-19 04:28:30.217', '2025-03-19 04:28:30.217', '0a2b4053-270c-4de0-b7e3-62fc736cf052'),
('e80ea8ec-76b9-48aa-82ab-d755ec4c3415', '96a98134-520d-4bc0-a2a6-c8a2b5c9e8aa', '32b4fe99-61cf-4c31-a481-4601fdbfa916', 'Cisco', '2025-03-19 04:28:38.677', '2025-03-19 04:28:38.677', '0a2b4053-270c-4de0-b7e3-62fc736cf052'),
('f9e00c98-ceac-43bb-b348-dc9f4fd2b0ae', '96a98134-520d-4bc0-a2a6-c8a2b5c9e8aa', 'c54e0285-612f-4dc5-873a-2f363d7a5763', 'Mickey Haller', '2025-03-19 04:28:20.046', '2025-03-19 04:28:20.046', '0a2b4053-270c-4de0-b7e3-62fc736cf052');

-- --------------------------------------------------------

--
-- Table structure for table `Genre`
--

CREATE TABLE `Genre` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL,
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Genre`
--

INSERT INTO `Genre` (`id`, `title`, `deleted_at`, `created_at`, `updated_at`) VALUES
('0h4j3k2l-1p0o-9i8u-7y6t-5r4e3w2q1s0d', 'Western', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('0m4w3q2s-1d0f-9g8h-7j6k-5l4p3o2i1u0y', 'Teen', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('0r4e3w2q-1s0d-9f8g-7h6j-5k4l3p2o1i0u', 'Superhero', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('182a4af6-e065-491f-9da3-fb6423e45119', 'Action', NULL, '2025-03-19 04:20:20.762', '2025-03-19 04:20:20.762'),
('1e5w4q3s-2d1f-0g9h-8j7k-6l5p4o3i2u1y', 'Noir', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('1j5k4l3p-2o1i-0u9y-8t7r-6e5w4q3s2d1f', 'Crime', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('1n5w4q3s-2d1f-0g9h-8j7k-6l5p4o3i2u1y', 'Apocalyptic', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('2e6w5q4s-3d2f-1g0h-9j8k-7l6p5o4i3u2y', 'Anime', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('2f4a91e5-5d7b-42e3-b8c2-a3e7b5f1d89c', 'Horror', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('2k6l5p4o-3i2u-1y0t-9r8e-7w6q5s4d3f2g', 'Mystery', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('2o6w5q4s-3d2f-1g0h-9j8k-7l6p5o4i3u2y', 'Steampunk', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('3a9c8e7d-1b5f-4c2a-9d6e-8f7g5h4j3k2l', 'Sci-Fi', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('3f7w6q5s-4d3f-2g1h-0j9k-8l7p6o5i4u3y', 'Experimental', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('3l7p6o5i-4u3y-2t1r-0e9w-8q7s6d5f4g3h', 'Biography', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('3p7w6q5s-4d3f-2g1h-0j9k-8l7p6o5i4u3y', 'Mockumentary', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('4b8d7e6f-5g4h-3j2k-1l0p-9o8i7u6y5t4r', 'Romance', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('4g8w7q6s-5d4f-3g2h-1j0k-9l8p7o6i5u4y', 'Psychological', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('4p8o7i6u-5y4t-3r2e-1w0q-9s8d7f6g5h4j', 'Family', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('4q8w7q6s-5d4f-3g2h-1j0k-9l8p7o6i5u4y', 'Slasher', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('5c9d8e7f-6g5h-4j3k-2l1p-0o9i8u7y6t5r', 'Thriller', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('5h9w8q7s-6d5f-4g3h-2j1k-0l9p8o7i6u5y', 'Disaster', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('5o9i8u7y-6t5r-4e3w-2q1s-0d9f8g7h6j5k', 'War', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('5r9w8q7s-6d5f-4g3h-2j1k-0l9p8o7i6u5y', 'Parody', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('6d0e9f8g-7h6j-5k4l-3p2o-1i0u9y8t7r6e', 'Animation', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('6i0u9y8t-7r6e-5w4q-3s2d-1f0g9h8j7k6l', 'History', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('6i0w9q8s-7d6f-5g4h-3j2k-1l0p9o8i7u6y', 'Cyberpunk', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('6s0w9q8s-7d6f-5g4h-3j2k-1l0p9o8i7u6y', 'Found Footage', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('7e1f0g9h-8j7k-6l5p-4o3i-2u1y0t9r8e7w', 'Documentary', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('7j1w0q9s-8d7f-6g5h-4j3k-2l1p0o9i8u7y', 'Neo-Noir', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('7u1y0t9r-8e7w-6q5s-4d3f-2g1h0j9k8l7p', 'Adventure', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('85d6e78b-e331-4f74-8948-e2918f67108b', 'Drama', NULL, '2025-03-19 04:20:23.779', '2025-03-19 04:20:23.780'),
('8f2g1h0j-9k8l-7p6o-5i4u-3y2t1r0e9w8q', 'Fantasy', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('8k2w1q0s-9d8f-7g6h-5j4k-3l2p1o0i9u8y', 'Martial Arts', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('8y2t1r0e-9w8q-7s6d-5f4g-3h2j1k0l9p8o', 'Sport', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('9g3h2j1k-0l9p-8o7i-6u5y-4t3r2e1w0q9s', 'Musical', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('9l3w2q1s-0d9f-8g7h-6j5k-4l3p2o1i0u9y', 'Dark Comedy', NULL, '2025-03-19 11:13:41.000', '2025-03-19 11:13:41.000'),
('9t3r2e1w-0q9s-8d7f-6g5h-4j3k2l1p0o9i', 'Short', NULL, '2025-03-19 11:13:21.000', '2025-03-19 11:13:21.000'),
('ee61f4b8-ae96-4857-bd34-71b068585a78', 'Comedy', NULL, '2025-03-19 04:24:14.876', '2025-03-19 04:24:14.876');

-- --------------------------------------------------------

--
-- Table structure for table `GenreRelation`
--

CREATE TABLE `GenreRelation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `film_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `genre_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL,
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `GenreRelation`
--

INSERT INTO `GenreRelation` (`id`, `film_id`, `genre_id`, `created_at`, `updated_at`) VALUES
('13d0951c-477c-4d87-8a7f-d042ac70a48a', '487aaa04-d9e4-436b-91e3-4d347fb75c42', 'ee61f4b8-ae96-4857-bd34-71b068585a78', '2025-03-20 01:21:52.069', '2025-03-20 01:21:52.069'),
('392ec7fd-a6ff-4889-bbc0-f874751b1808', '0771bc92-1ec4-4419-9afd-eb5e4ad2ba93', '85d6e78b-e331-4f74-8948-e2918f67108b', '2025-03-19 04:23:17.072', '2025-03-19 04:23:17.072'),
('414df4bf-1c7f-4f99-b344-52b968f42991', '38c63cef-2f20-4baf-9efa-60f3f78ce7a9', 'ee61f4b8-ae96-4857-bd34-71b068585a78', '2025-03-19 04:24:49.969', '2025-03-19 04:24:49.969'),
('4e179752-936c-4abc-a354-fe2b9a0a1bb7', '96a98134-520d-4bc0-a2a6-c8a2b5c9e8aa', '1j5k4l3p-2o1i-0u9y-8t7r-6e5w4q3s2d1f', '2025-03-19 04:25:34.812', '2025-03-19 04:25:34.812'),
('4fbe51e6-3942-4651-8180-bb9e6ad3bd48', '0771bc92-1ec4-4419-9afd-eb5e4ad2ba93', '182a4af6-e065-491f-9da3-fb6423e45119', '2025-03-19 04:23:17.072', '2025-03-19 04:23:17.072'),
('cd0d00e1-cfb9-4ca3-8dfe-4b067cd4628e', '0771bc92-1ec4-4419-9afd-eb5e4ad2ba93', '7u1y0t9r-8e7w-6q5s-4d3f-2g1h0j9k8l7p', '2025-03-19 04:23:17.072', '2025-03-19 04:23:17.072'),
('d13827f2-01d5-4d3c-94dd-cef4e9ae6310', '96a98134-520d-4bc0-a2a6-c8a2b5c9e8aa', '85d6e78b-e331-4f74-8948-e2918f67108b', '2025-03-19 04:25:34.812', '2025-03-19 04:25:34.812'),
('d6818379-b871-46c1-b3df-3fcdad1e556c', '38c63cef-2f20-4baf-9efa-60f3f78ce7a9', '85d6e78b-e331-4f74-8948-e2918f67108b', '2025-03-19 04:24:49.969', '2025-03-19 04:24:49.969'),
('e00bc186-a355-4641-9bdb-ec7000631f8c', '38c63cef-2f20-4baf-9efa-60f3f78ce7a9', '5c9d8e7f-6g5h-4j3k-2l1p-0o9i8u7y6t5r', '2025-03-19 04:24:49.969', '2025-03-19 04:24:49.969');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('subs','admin','author') COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL,
  `updated_at` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notlp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `deleted_at`, `created_at`, `updated_at`, `isActive`, `photo`, `notlp`) VALUES
('0a2b4053-270c-4de0-b7e3-62fc736cf052', 'Muhammad Ikhsan Morgan', 'morgan@gmail.com', '$2b$12$sY51nmDglmffoLfFI6gB1OsmztX5m9lVTlaeBN3yO.UpEBBf6Iufe', 'admin', NULL, '2025-03-19 03:08:51.811', '2025-03-19 03:08:51.811', 1, '/uploads/profile/b2dea4d9-8150-43b8-ae45-04377ae0e8b7.jpg', '085756676768'),
('1ba19517-9220-4948-b426-8e12ec6f3b08', 'Morgan', 'morgan@morgan.com', '$2b$12$OKdDV9EeYnMgHmyJFcJgLO/oyOPCbUWhRIzEyvuvI07xkHJ7OC0DW', 'subs', NULL, '2025-03-19 03:14:32.274', '2025-03-19 03:14:32.274', 1, '/uploads/profile/f0834824-acf8-487f-a601-86cdb8551e40.jpg', '081234567'),
('4e52c67c-8974-4bdd-9ec9-da572d1a25c3', 'Morgan subs', 'morgansubs@gmail.com', '$2b$12$k1BzzoFQCesAiBjesjk4k.PxrLEYvQ/ysK/RmSIXsjvcxllPojhHC', 'subs', NULL, '2025-03-19 03:11:53.989', '2025-03-19 03:11:53.989', 1, '/uploads/profile/4c2160ab-7a46-4a4c-b67a-574fe8c6a561.jpg', '0895802241485'),
('64a29441-ef47-4a49-8300-7ebdf903e1c2', 'Morgan', 'morganauthor@gmail.com', '$2b$12$5rcL8utK6uqWk8OtpUE4cuqUbtImHShkQyaYWcZpGzGdVR.LyJmWS', 'author', NULL, '2025-03-20 01:45:38.002', '2025-03-20 01:45:38.002', 1, NULL, '085756676768'),
('67088716-6a3c-460c-bda9-850d42d9b92e', 'Muhammad Ikhsan Morgan Nurfiantoro', 'morgan2@gmail.com', '$2b$12$9qxVSYWd6wTQxnuh3fgpvuFM6cTSN0S3rT0VoFoDpWYs6JwMBSTeu', 'subs', NULL, '2025-03-19 03:17:20.443', '2025-03-19 03:17:20.443', 1, NULL, '085756676769');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('187c26a2-a0e8-4506-a66e-f02e374a702b', '8be389ffbb588119ebb86f1f82fd826707753d139c448a230eee1f64c86aae4c', '2025-03-19 02:59:10.054', '20250316125253_update_on_delete_nullable', NULL, NULL, '2025-03-19 02:59:09.685', 1),
('23049e8e-7e3d-4d09-9964-187b9619da58', 'cbf0df79c738b704cdbb21210284a1741616201b3652e1916c406e902655d2a4', '2025-03-19 02:59:08.095', '20250219052701_release_year_to_date', NULL, NULL, '2025-03-19 02:59:07.967', 1),
('2db3f7fe-0d44-4932-a011-ea742e5f4565', '9a76860060a88daee8fe7e9b733b2d0f5a3a53bfb42592597274f4fcc3822e4d', '2025-03-19 03:00:46.060', '20250319030045_input_nomor_telepon', NULL, NULL, '2025-03-19 03:00:45.823', 1),
('4a87b8ae-2289-48fa-aaac-1fdb8ec60ace', 'b2e1e563f7fc7a69c6b4f37046e282016f953c24942d4c9522b81354d26c91ca', '2025-03-19 02:59:09.480', '20250305022809_on_cascade_fix', NULL, NULL, '2025-03-19 02:59:09.283', 1),
('68d21b8e-d224-4a7f-8330-de105404d41f', 'a16085ad6bd11698d8f2f06847c62635a59279308143799b8bfe3abc48289c69', '2025-03-19 02:59:08.680', '20250227022142_idk_what_the_fuvk_is_goin_on', NULL, NULL, '2025-03-19 02:59:08.231', 1),
('6c7350e2-4aa0-43f7-88bd-8641fc43026d', 'f2ed899199e99b1b5fdfb500c7fd0c316fab6e138b0a3a0abad02e1fb239ba26', '2025-03-19 02:59:08.224', '20250219065120_reverttoreleaseyearcozitsconfusing', NULL, NULL, '2025-03-19 02:59:08.101', 1),
('6dbedbe6-f95e-45de-b76c-f028a53d2de0', '7da849674735cc255ecb83675a6f3b31bdb627813421cb47ed70303bb67df57b', '2025-03-19 02:59:23.427', '20250319025923_input_ulang', NULL, NULL, '2025-03-19 02:59:23.287', 1),
('707922e0-a212-4d93-afff-80a2c7a4c9da', 'a0e7094ba6eeb60242a0084d2a25f08ddb899827e9b8e63582041f55995bc543', '2025-03-19 02:59:09.277', '20250304141442_mengganti_enum_ke_integer', NULL, NULL, '2025-03-19 02:59:09.117', 1),
('a2fc2d79-4f22-4aac-a102-1ddebd69470f', '7c2728bcd1a17d06850007dbfa4b3646457590f760bac7a9f0e6c29f5125ae27', '2025-03-19 02:59:07.959', '20250219034056_first_commit_after_migrate', NULL, NULL, '2025-03-19 02:59:07.049', 1),
('baadb190-b032-4bff-b24c-9a00eb63147d', 'ca580034358cc0372db29eb8786baca8314f5020af18c49af178f8a33ef34103', '2025-03-19 02:59:09.112', '20250228014315_add_created_by_on_cast_on_filmcast', NULL, NULL, '2025-03-19 02:59:08.685', 1),
('bdba938f-eac0-47e4-9e72-f9534ae2c326', 'd5d7504a57ea5201834991a7c529b75f116e3505f35528d289d8ac00b8bd65cb', '2025-03-19 02:59:10.700', '20250316130237_user_on_delete_cascade', NULL, NULL, '2025-03-19 02:59:10.059', 1),
('c0a98c1c-984e-4c1e-811f-4a50eafd80c7', '954d534c22295739434b48b70707c284227aa43dbbcc48fd3e31da7369c9b693', '2025-03-19 02:59:09.677', '20250309143409_on_delete_cascade_genre_id', NULL, NULL, '2025-03-19 02:59:09.485', 1),
('d1ea0ada-9537-4aea-a40e-7a9947cc0ad8', 'd5d1cfc9d140bf7164424815c8cc6ab1ed832db6e65abcd781008ce019355caf', '2025-03-19 03:03:15.879', '20250319030315_int_to_varchar', NULL, NULL, '2025-03-19 03:03:15.697', 1),
('f370fc6d-7f96-482c-9c76-abac4ef4ca4d', '249aff7c90c3491fcecd883c6f81dba25e5b91e5174b2f39fad119739c92105a', '2025-03-19 03:41:10.721', '20250319034110_delete_field_cast_yang_ga_penting_di_film', NULL, NULL, '2025-03-19 03:41:10.564', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Cast`
--
ALTER TABLE `Cast`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Cast_createdBy_fkey` (`createdBy`);

--
-- Indexes for table `Comment`
--
ALTER TABLE `Comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Comment_user_id_fkey` (`user_id`),
  ADD KEY `Comment_film_id_fkey` (`film_id`);

--
-- Indexes for table `Film`
--
ALTER TABLE `Film`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Film_postedBy_fkey` (`postedBy`);

--
-- Indexes for table `FilmCast`
--
ALTER TABLE `FilmCast`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FilmCast_film_id_fkey` (`film_id`),
  ADD KEY `FilmCast_cast_id_fkey` (`cast_id`),
  ADD KEY `FilmCast_createdBy_fkey` (`createdBy`);

--
-- Indexes for table `Genre`
--
ALTER TABLE `Genre`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `GenreRelation`
--
ALTER TABLE `GenreRelation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `GenreRelation_film_id_fkey` (`film_id`),
  ADD KEY `GenreRelation_genre_id_fkey` (`genre_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Cast`
--
ALTER TABLE `Cast`
  ADD CONSTRAINT `Cast_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Comment`
--
ALTER TABLE `Comment`
  ADD CONSTRAINT `Comment_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `Film` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `Film`
--
ALTER TABLE `Film`
  ADD CONSTRAINT `Film_postedBy_fkey` FOREIGN KEY (`postedBy`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `FilmCast`
--
ALTER TABLE `FilmCast`
  ADD CONSTRAINT `FilmCast_cast_id_fkey` FOREIGN KEY (`cast_id`) REFERENCES `Cast` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FilmCast_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FilmCast_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `Film` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `GenreRelation`
--
ALTER TABLE `GenreRelation`
  ADD CONSTRAINT `GenreRelation_film_id_fkey` FOREIGN KEY (`film_id`) REFERENCES `Film` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `GenreRelation_genre_id_fkey` FOREIGN KEY (`genre_id`) REFERENCES `Genre` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
