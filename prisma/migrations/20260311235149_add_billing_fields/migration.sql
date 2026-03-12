-- AlterTable
ALTER TABLE "User" ADD COLUMN     "billingAddress" TEXT,
ADD COLUMN     "billingCity" TEXT,
ADD COLUMN     "billingCountry" TEXT DEFAULT 'ES',
ADD COLUMN     "billingName" TEXT,
ADD COLUMN     "billingNif" TEXT,
ADD COLUMN     "billingZip" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT;
