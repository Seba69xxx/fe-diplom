import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://students.netoservices.ru/fe-diplom',
});

export default instance;