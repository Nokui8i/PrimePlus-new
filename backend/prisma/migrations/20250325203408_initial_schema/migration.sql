-- AlterTable
ALTER TABLE "_CollectionToPost" ADD CONSTRAINT "_CollectionToPost_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CollectionToPost_AB_unique";
