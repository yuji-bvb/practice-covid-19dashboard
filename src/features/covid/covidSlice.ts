import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import dataDaily from "./apiDataDaily.json";

const apiUrl = "https://api.covid19api.com/total/country";

type DATADAILY = typeof dataDaily; //インポートしたjsonフォルダで型定義

type covidState = {
  daily: DATADAILY;
  country: string;
};
//初期値の設定
const initialState: covidState = {
  daily: dataDaily,
  country: "Japan",
};
//非同期処理
export const fetchAsyncGetDaily = createAsyncThunk(
  "covid/getDaily",
  async (country: string) => {
    const { data } = await axios.get<DATADAILY>(`${apiUrl}/${country}`);
    return { data: data, country: country };
  }
);
//createの実態
const covidSlice = createSlice({
  name: "covid",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetDaily.fulfilled, (state, action) => {
      return {
        ...state,
        daily: action.payload.data,
        country: action.payload.country,
      };
    });
  },
});

//useSelectorで参照できるようにエクスポート
export const selectDaily = (state: RootState) => state.covid.daily;
export const selectCountry = (state: RootState) => state.covid.country;

export default covidSlice.reducer;
