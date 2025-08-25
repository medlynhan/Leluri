# Menggunakan image node alpine sebagai base image
FROM node:22

# Menentukan direktori kerja dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json untuk install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Menyalin semua file proyek ke dalam container
COPY .env.local .env.local

COPY . .

# Menjalankan build Next.js (meskipun tidak ada build khusus, ini tetap disarankan untuk produksi)
RUN npm run build

# Menjalankan aplikasi Next.js
CMD ["npm", "start"]

# Expose port 3000 agar aplikasi bisa diakses dari luar container
EXPOSE 3000
