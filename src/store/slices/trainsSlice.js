import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

const formatDateForApi = (dateString) => {
  if (!dateString) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  const parts = dateString.split('.');
  if (parts.length !== 3) return undefined;
  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
};

const applyFilters = (items, filters) => {
  if (!items || !items.length) return [];

  return items.filter((item) => {
    const dep = item.departure;

    if (filters.have_second_class && !dep.have_second_class) return false;
    if (filters.have_third_class && !dep.have_third_class) return false;
    if (filters.have_fourth_class && !dep.have_fourth_class) return false;
    if (filters.have_first_class && !dep.have_first_class) return false;
    if (filters.have_wifi && !dep.have_wifi) return false;
    if (filters.have_express && !dep.is_express) return false;
    if (filters.have_air_conditioning && !dep.have_air_conditioning)
      return false;

    const isPriceFilterInactive =
      filters.price_from <= 10 && filters.price_to >= 7000;

    if (!isPriceFilterInactive) {
      const prices = [
        dep.price_info.second?.price,
        dep.price_info.third?.price,
        dep.price_info.fourth?.price,
        dep.price_info.first?.price,
      ].filter((p) => typeof p === 'number');

      if (prices.length === 0) return false;

      const minPriceInTicket = Math.min(...prices);
      const maxPriceInTicket = Math.max(...prices);

      if (minPriceInTicket < filters.price_from) return false;
      if (maxPriceInTicket > filters.price_to) return false;
    }

    const depDate = new Date(dep.from.datetime * 1000);
    const arrDate = new Date(dep.to.datetime * 1000);
    const depHour = depDate.getHours();
    const arrHour = arrDate.getHours();

    const isDefaultDepTime =
      filters.start_departure_hour_from === 0 &&
      filters.start_departure_hour_to === 24;
    const isDefaultArrTime =
      filters.start_arrival_hour_from === 0 &&
      filters.start_arrival_hour_to === 24;

    if (!isDefaultDepTime) {
      if (
        depHour < filters.start_departure_hour_from ||
        depHour > filters.start_departure_hour_to
      )
        return false;
    }
    if (!isDefaultArrTime) {
      if (
        arrHour < filters.start_arrival_hour_from ||
        arrHour > filters.start_arrival_hour_to
      )
        return false;
    }

    if (item.arrival) {
      const backDepDate = new Date(item.arrival.from.datetime * 1000);
      const backArrDate = new Date(item.arrival.to.datetime * 1000);
      const backDepHour = backDepDate.getHours();
      const backArrHour = backArrDate.getHours();

      const isDefaultBackDep =
        filters.end_departure_hour_from === 0 &&
        filters.end_departure_hour_to === 24;
      const isDefaultBackArr =
        filters.end_arrival_hour_from === 0 &&
        filters.end_arrival_hour_to === 24;

      if (!isDefaultBackDep) {
        if (
          backDepHour < filters.end_departure_hour_from ||
          backDepHour > filters.end_departure_hour_to
        )
          return false;
      }
      if (!isDefaultBackArr) {
        if (
          backArrHour < filters.end_arrival_hour_from ||
          backArrHour > filters.end_arrival_hour_to
        )
          return false;
      }
    }

    return true;
  });
};

const applySort = (items, sortBy) => {
  const sorted = [...items];
  return sorted.sort((a, b) => {
    if (sortBy === 'price') {
      return 0;
    }
    if (sortBy === 'duration') {
      return a.departure.duration - b.departure.duration;
    }
    return a.departure.from.datetime - b.departure.from.datetime;
  });
};

export const fetchRoutes = createAsyncThunk(
  'trains/fetchRoutes',
  async (_, { getState }) => {
    const { search, trains } = getState();
    const { form, filters } = search;
    const { sortBy, limit, offset } = trains;

    const params = {
      from_city_id: form.from_city_id,
      to_city_id: form.to_city_id,
      date_start: formatDateForApi(form.date_start),
      date_end: formatDateForApi(form.date_end),
      limit: 5000,
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    if (!params.from_city_id || !params.to_city_id) {
      return { items: [], total_count: 0 };
    }

    try {
      const response = await axios.get('/routes', { params });
      let allItems = response.data.items || [];

      allItems = applyFilters(allItems, filters);
      allItems = applySort(allItems, sortBy);

      const totalCount = allItems.length;
      const currentLimit = Number(limit);
      const currentOffset = Number(offset);

      const pagedItems = allItems.slice(
        currentOffset,
        currentOffset + currentLimit
      );

      return {
        items: pagedItems,
        total_count: totalCount,
      };
    } catch (error) {
      console.error('API Search Error:', error);
      throw error;
    }
  }
);

const initialState = {
  routes: [],
  total_count: 0,
  sortBy: 'date',
  limit: 5,
  offset: 0,
  status: 'idle',
  error: null,
};

const trainsSlice = createSlice({
  name: 'trains',
  initialState,
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.offset = 0;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.offset = 0;
    },
    setOffset: (state, action) => {
      state.offset = action.payload;
    },
    clearRoutes: (state) => {
      state.routes = [];
      state.total_count = 0;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.routes = action.payload.items;
        state.total_count = action.payload.total_count;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearRoutes, setSortBy, setLimit, setOffset } =
  trainsSlice.actions;
export default trainsSlice.reducer;