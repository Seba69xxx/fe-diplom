import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchCities = createAsyncThunk(
  'search/fetchCities',
  async (searchString) => {
    const response = await axios.get(`/routes/cities?name=${searchString}`);
    return response.data;
  }
);

const initialState = {
  form: {
    from_city_id: '',
    from_city_name: '',
    to_city_id: '',
    to_city_name: '',
    date_start: '',
    date_end: '',
  },
  filters: {
    have_first_class: false,
    have_second_class: false,
    have_third_class: false,
    have_fourth_class: false,
    have_wifi: false,
    have_express: false,
    price_from: 10,
    price_to: 10000,
    start_departure_hour_from: 0,
    start_departure_hour_to: 24,
    start_arrival_hour_from: 0,
    start_arrival_hour_to: 24,
    end_departure_hour_from: 0,
    end_departure_hour_to: 24,
    end_arrival_hour_from: 0,
    end_arrival_hour_to: 24,
  },
  cities: [],
  status: 'idle',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    setFilter: (state, action) => {
      const { field, value } = action.payload;
      state.filters[field] = value;
    },
    resetSearch: (state) => {
      state.form = initialState.form;
      state.filters = initialState.filters;
    },
    clearCities: (state) => {
      state.cities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state) => {
        state.status = 'failed';
        state.cities = [];
      });
  },
});

export const { setSearchField, setFilter, resetSearch, clearCities } =
  searchSlice.actions;
export default searchSlice.reducer;