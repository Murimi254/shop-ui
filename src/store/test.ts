import { createSlice } from "@reduxjs/toolkit";
interface InitialState {
  value: number;
}
const initialState: InitialState = {
  value: 30,
};
const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: state => {
      state.value++;
    },
  },
});

export const { increment } = counterSlice.actions;
export default counterSlice;
