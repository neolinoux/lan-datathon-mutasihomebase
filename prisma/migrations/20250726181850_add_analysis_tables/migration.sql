-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'operator', 'viewer');

-- CreateEnum
CREATE TYPE "AnalysisType" AS ENUM ('compliance', 'sentiment', 'recommendation');

-- CreateEnum
CREATE TYPE "IndicatorType" AS ENUM ('document', 'sentiment');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('dok_kegiatan', 'dok_keuangan');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'viewer',
    "institution_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "full_name" TEXT,
    "category" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "established_year" INTEGER,
    "total_employees" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "filename" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER,
    "file_type" TEXT,
    "institution_id" INTEGER NOT NULL,
    "uploaded_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_results" (
    "id" SERIAL NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "institution_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "judul_kegiatan" TEXT NOT NULL,
    "deskripsi_kegiatan" TEXT NOT NULL,
    "include_dok_keuangan" BOOLEAN NOT NULL DEFAULT false,
    "path_dok_kegiatan" TEXT,
    "path_dok_keuangan" TEXT,
    "score_compliance" DOUBLE PRECISION NOT NULL,
    "tingkat_risiko" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'success',
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "documentId" INTEGER,

    CONSTRAINT "analysis_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_files" (
    "id" SERIAL NOT NULL,
    "analysis_id" INTEGER NOT NULL,
    "file_type" "FileType" NOT NULL,
    "original_name" TEXT NOT NULL,
    "stored_path" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_compliance_indicators" (
    "id" SERIAL NOT NULL,
    "analysis_id" INTEGER NOT NULL,
    "id_indikator" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "encode_class" INTEGER NOT NULL,
    "detail_analisis" TEXT NOT NULL,
    "alasan_analisis" TEXT NOT NULL,
    "score_indikator" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_compliance_indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_recommendations" (
    "id" SERIAL NOT NULL,
    "analysis_id" INTEGER NOT NULL,
    "id_indikator" INTEGER NOT NULL,
    "judul_rekomendasi" TEXT NOT NULL,
    "deskripsi_rekomendasi" TEXT NOT NULL,
    "langkah_rekomendasi" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_related_regulations" (
    "id" SERIAL NOT NULL,
    "analysis_id" INTEGER NOT NULL,
    "judul_peraturan" TEXT NOT NULL,
    "instansi" TEXT NOT NULL,
    "tingkat_kepatuhan" DOUBLE PRECISION NOT NULL,
    "url_pera" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_related_regulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_indicators" (
    "id" SERIAL NOT NULL,
    "institution_id" INTEGER NOT NULL,
    "indicator_name" TEXT NOT NULL,
    "indicator_type" "IndicatorType" NOT NULL,
    "sangat_sesuai" INTEGER NOT NULL DEFAULT 0,
    "sebagian_sesuai" INTEGER NOT NULL DEFAULT 0,
    "tidak_sesuai" INTEGER NOT NULL DEFAULT 0,
    "none_count" INTEGER NOT NULL DEFAULT 0,
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compliance_indicators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "analysis_results_analysis_id_key" ON "analysis_results"("analysis_id");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_indicators_institution_id_indicator_name_key" ON "compliance_indicators"("institution_id", "indicator_name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_files" ADD CONSTRAINT "analysis_files_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analysis_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_compliance_indicators" ADD CONSTRAINT "analysis_compliance_indicators_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analysis_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_recommendations" ADD CONSTRAINT "analysis_recommendations_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analysis_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_related_regulations" ADD CONSTRAINT "analysis_related_regulations_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analysis_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_indicators" ADD CONSTRAINT "compliance_indicators_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
