import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchSeats = createAsyncThunk(
  'order/fetchSeats',
  async (id) => {
    const response = await axios.get(`/routes/${id}/seats`);
    return response.data;
  }
);

export const fetchSeatsArrival = createAsyncThunk(
  'order/fetchSeatsArrival',
  async (id) => {
    const response = await axios.get(`/routes/${id}/seats`);
    return response.data;
  }
);

const initialState = {
  selectedTrain: {
    departure: null,
    arrival: null,
  },
  seatsData: [],
  seatsDataArrival: [],
  loading: false,
  error: null,
  selectedSeatsDeparture: [],
  selectedSeatsArrival: [],
  selectedAdditionalOptions: {},
  passengerCount: {
    adults: 0,
    children: 0,
    childrenNoSeat: 0,
  },
  passengers: [],
  payer: {
    surname: '',
    name: '',
    patron: '',
    phone: '',
    email: '',
    paymentMethod: 'cash',
  },
  filterType: 'third',
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setSelectedTrain: (state, action) => {
      state.selectedTrain = action.payload;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    clearOrder: () => {
      return initialState;
    },
    clearSectionSeats: (state, action) => {
      const { direction } = action.payload;
      if (direction === 'departure') {
        state.selectedSeatsDeparture = [];
      } else if (direction === 'arrival') {
        state.selectedSeatsArrival = [];
      }
    },
    setPassengerCount: (state, action) => {
      const { type, count } = action.payload;
      state.passengerCount[type] = count;
    },
    toggleSeat: (state, action) => {
      const { direction, seat } = action.payload;
      const targetList =
        direction === 'arrival'
          ? state.selectedSeatsArrival
          : state.selectedSeatsDeparture;

      const existIndex = targetList.findIndex(
        (s) => s.coach_id === seat.coach_id && s.seat_number === seat.seat_number
      );

      if (existIndex >= 0) {
        targetList.splice(existIndex, 1);
      } else {
        targetList.push(seat);
      }
    },
    toggleService: (state, action) => {
      const { coachId, service } = action.payload;
      if (!state.selectedAdditionalOptions[coachId]) {
        state.selectedAdditionalOptions[coachId] = {};
      }
      const currentVal = state.selectedAdditionalOptions[coachId][service];
      if (currentVal) {
        delete state.selectedAdditionalOptions[coachId][service];
      } else {
        state.selectedAdditionalOptions[coachId][service] = true;
      }
    },
    updatePayerField: (state, action) => {
      const { field, value } = action.payload;
      state.payer[field] = value;
    },
    setPaymentMethod: (state, action) => {
      state.payer.paymentMethod = action.payload;
    },
    setPassengers: (state, action) => {
      state.passengers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.seatsData = action.payload;
      })
      .addCase(fetchSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder.addCase(fetchSeatsArrival.fulfilled, (state, action) => {
      state.seatsDataArrival = action.payload;
    });
  },
});

export const {
  setSelectedTrain,
  setFilterType,
  clearOrder,
  clearSectionSeats,
  setPassengerCount,
  toggleSeat,
  toggleService,
  updatePayerField,
  setPaymentMethod,
  setPassengers,
} = orderSlice.actions;

export default orderSlice.reducer;