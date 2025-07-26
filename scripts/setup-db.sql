-- Setup Database untuk LAN Datathon AI Compliance Assistant

-- Create database (run this as superuser)
-- CREATE DATABASE lan_datathon;

-- Connect to database
-- \c lan_datathon;

-- Insert sample institutions
INSERT INTO institutions (name, category, address, phone, email, website, founded_year, total_employees, total_documents) VALUES
('Badan Pusat Statistik', 'Lembaga Pemerintah Non Kementerian', 'Jl. Dr. Sutomo No.6-8, Jakarta 10710', '021-3841195', 'bpshq@bps.go.id', 'https://www.bps.go.id', 1960, 12000, 1500),
('Kementerian Keuangan', 'Kementerian', 'Jl. Dr. Wahidin Raya No.1, Jakarta 10710', '021-3449230', 'humas@kemenkeu.go.id', 'https://www.kemenkeu.go.id', 1945, 80000, 3000),
('Kementerian Dalam Negeri', 'Kementerian', 'Jl. Medan Merdeka Utara No.7, Jakarta 10110', '021-34832556', 'humas@kemendagri.go.id', 'https://www.kemendagri.go.id', 1945, 45000, 2000);

-- Insert sample users (password: admin123)
INSERT INTO users (name, email, password_hash, role, institution_id, is_active) VALUES
('Admin Super', 'admin@lan-datathon.go.id', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O', 'admin', NULL, true),
('Andi Setiawan', 'andi@bps.go.id', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O', 'admin', 1, true),
('Budi Santoso', 'budi@bps.go.id', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O', 'operator', 1, true),
('Citra Dewi', 'citra@bps.go.id', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O', 'viewer', 1, true),
('Dewi Sartika', 'dewi@kemenkeu.go.id', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O', 'admin', 2, true),
('Eko Prasetyo', 'eko@kemendagri.go.id', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8O', 'admin', 3, true);

-- Insert sample compliance indicators
INSERT INTO compliance_indicators (institution_id, indicator_name, indicator_type, sangat_sesuai, sebagian_sesuai, tidak_sesuai, none_count) VALUES
(1, 'Transparansi Anggaran', 'document', 45, 23, 12, 20),
(1, 'Akuntabilitas Pelaporan', 'document', 38, 31, 18, 13),
(1, 'Kepatuhan Regulasi', 'document', 52, 28, 15, 5),
(1, 'Efisiensi Operasional', 'document', 41, 35, 19, 5),
(1, 'Kualitas Layanan', 'sentiment', 48, 32, 15, 5),
(1, 'Kepuasan Stakeholder', 'sentiment', 42, 38, 16, 4),
(2, 'Transparansi Anggaran', 'document', 55, 25, 15, 5),
(2, 'Akuntabilitas Pelaporan', 'document', 48, 32, 16, 4),
(2, 'Kepatuhan Regulasi', 'document', 62, 28, 8, 2),
(2, 'Efisiensi Operasional', 'document', 45, 35, 18, 2),
(2, 'Kualitas Layanan', 'sentiment', 52, 35, 10, 3),
(2, 'Kepuasan Stakeholder', 'sentiment', 46, 40, 12, 2),
(3, 'Transparansi Anggaran', 'document', 42, 28, 20, 10),
(3, 'Akuntabilitas Pelaporan', 'document', 38, 35, 22, 5),
(3, 'Kepatuhan Regulasi', 'document', 45, 32, 18, 5),
(3, 'Efisiensi Operasional', 'document', 35, 40, 20, 5),
(3, 'Kualitas Layanan', 'sentiment', 40, 38, 18, 4),
(3, 'Kepuasan Stakeholder', 'sentiment', 36, 42, 19, 3); 