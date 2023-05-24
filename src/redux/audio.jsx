import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// initializing state
const initialState = {
  loading: false,
  musics: null,
  music: null,
  charts: null,
  sucess: null,
  error: null,
  playingId: null,
  nowplaying: false,
  subscriptions: [],
  subscriber: null,
  subscriptionNo: 0,
  success: null,
  owner: null,
  contract: null,
  provider: null
};

// Generates async functions

export const logUser = createAsyncThunk("musics/logUser",
  async (ownerId, { rejectWithValue }) => {
    try {
      const response = await axios.post("https://strtmbackend.richeshomesconsult.com/api/user", { ownerId });
      localStorage.setItem("token", response.data.msg);
      return ownerId;
    } catch (error) {
      return rejectWithValue(error.response.data.err);
    }
  }
);

export const createMusic = createAsyncThunk("musics/createMusic",
  async (form, { rejectWithValue }) => {
    try {
      const response = await axios.post("https://strtmbackend.richeshomesconsult.com/api/music", form);
      return response.data.msg;
    } catch (error) {
      return rejectWithValue(error.response.data.err);
    }
  }
);

export const likeOrUnlike = createAsyncThunk("musics/likeOrUnlike",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`https://strtmbackend.richeshomesconsult.com/api/music/like?id=${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.err);
    }
  }
);

export const subscribeToUser = createAsyncThunk("musics/subscribeToUser",
  async ({ email, ownerId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`https://strtmbackend.richeshomesconsult.com/api/subscription/?address=${ownerId}`, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const unSubscribeToUser = createAsyncThunk("musics/unSubscribeToUser",
  async ({ email, ownerId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`https://strtmbackend.richeshomesconsult.com/api/subscription/unscribe?address=${ownerId}`, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const upgradeStorage = createAsyncThunk("musics/upgradeStorage",
  async (form, { rejectWithValue }) => {
    try {
      const response = await axios.put(`https://strtmbackend.richeshomesconsult.com/api/user/storage`, form);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const endandClaimBounty = createAsyncThunk("musics/endandClaimBounty",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`https://strtmbackend.richeshomesconsult.com/api/music/ended?id=${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMusics = createAsyncThunk("musics/fetchMusics",
  async (cat, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://strtmbackend.richeshomesconsult.com/api/music/${cat.toLowerCase()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.err);
    }
  }
);
export const fetchCharts = createAsyncThunk("musics/fetchCharts", () => {
  return axios.get("https://strtmbackend.richeshomesconsult.com/api/music/topcharts").then((response) => response.data);
});
export const fetchPlaylist = createAsyncThunk("musics/fetchPlaylist", (e) => {
  return axios.get(`https://strtmbackend.richeshomesconsult.com/api/music/playlist/${e}`).then((response) => response.data);
});
export const fetchLiked = createAsyncThunk("musics/fetchLiked", () => {
  return axios.get(`https://strtmbackend.richeshomesconsult.com/api/music/liked`).then((response) => response.data);
});
export const fetchFewSubscription = createAsyncThunk("musics/fetchFewSubscription", () => {
  return axios.get(`https://strtmbackend.richeshomesconsult.com/api/subscription/few`).then((response) => response.data);
});
export const fetchSubscription = createAsyncThunk("musics/fetchSubscription", () => {
  return axios.get(`https://strtmbackend.richeshomesconsult.com/api/subscription/`).then((response) => response.data);
});
export const fetchSubscriptionMusics = createAsyncThunk("musics/fetchSubscriptionMusics", (id) => {
  return axios.get(`https://strtmbackend.richeshomesconsult.com/api/subscription/${id}`).then((response) => response.data);
});
export const fetchSubscriptionNo = createAsyncThunk("musics/fetchSubscriptionNo", (id) => {
  return axios.get(`https://strtmbackend.richeshomesconsult.com/api/subscription/owner/${id}`).then((response) => response.data);
});
export const filterMusic = createAsyncThunk("musics/filterMusic", (title) => {
  return axios.get(`https://strtmbackend.richeshomesconsult.com/api/music/filter/${title}`).then((response) => response.data);
});

// working for likes

//
const musicSlice = createSlice({
  name: "strtmusic",
  initialState,

  // working for async fetching data
  extraReducers: (builder) => {
    builder.addCase(fetchMusics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMusics.fulfilled, (state, action) => {
      state.loading = false;
      state.musics = action.payload;
      state.error = null;
    });
    builder.addCase(fetchMusics.rejected, (state, action) => {
      state.loading = false;
      state.musics = null;
      state.error = action.error.message;
    });
    //
    builder.addCase(fetchPlaylist.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPlaylist.fulfilled, (state, action) => {
      state.loading = false;
      state.music = action.payload.msg;
      state.error = null;
    });
    builder.addCase(fetchPlaylist.rejected, (state, action) => {
      state.loading = false;
      state.music = null;
      state.error = action.error.message;
    });
    //
    // CHARTS
    builder.addCase(fetchCharts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCharts.fulfilled, (state, action) => {
      state.loading = false;
      state.charts = action.payload.msg;
      state.error = null;
    });
    builder.addCase(fetchCharts.rejected, (state, action) => {
      state.loading = false;
      state.charts = null;
      state.error = action.error.message;
    });
    //
    // Liked
    builder.addCase(fetchLiked.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLiked.fulfilled, (state, action) => {
      state.loading = false;
      state.musics = action.payload.msg;
      state.error = null;
    });
    builder.addCase(fetchLiked.rejected, (state, action) => {
      state.loading = false;
      state.musics = null;
      state.error = action.error.message;
    });
    //
    // likeOrUnlike
    builder.addCase(likeOrUnlike.pending, () => {
      // state.loading = true;
    });
    builder.addCase(likeOrUnlike.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(likeOrUnlike.rejected, () => {
      // state.loading = false;
    });
    // fetchSubscriptionMusics
    builder.addCase(fetchSubscriptionMusics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSubscriptionMusics.fulfilled, (state, action) => {
      state.loading = false;
      state.musics = action.payload.msg;
      state.subscriber = action.payload.subscriber;
      state.error = null;
    });
    builder.addCase(fetchSubscriptionMusics.rejected, (state, action) => {
      state.loading = false;
      state.musics = null;
      state.subscriber = null;
      state.error = action.error.message;
    });
    // SUBSCRIBEToUser
    builder.addCase(subscribeToUser.pending, () => {
      // state.loading = true;
    });
    builder.addCase(subscribeToUser.fulfilled, (state, action) => {
      state.success = action.payload.msg;
      state.error = null;
    });
    builder.addCase(subscribeToUser.rejected, (state, action) => {
      state.error = action.payload.err;
    });
    // SUBSCRIBEToUser
    builder.addCase(upgradeStorage.pending, () => {
      // state.loading = true;
    });
    builder.addCase(upgradeStorage.fulfilled, (state, action) => {
      state.success = action.payload.msg;
      state.error = null;
    });
    builder.addCase(upgradeStorage.rejected, (state, action) => {
      state.error = action.payload.err;
    });
    //
    // unSubscribeToUser
    builder.addCase(unSubscribeToUser.pending, () => {
      // state.loading = true;
    });
    builder.addCase(unSubscribeToUser.fulfilled, (state, action) => {
      state.success = action.payload.msg;
      state.error = null;
    });
    builder.addCase(unSubscribeToUser.rejected, (state, action) => {
      state.error = action.payload.err;
    });
    // 
    // fetchFewSubscription
    builder.addCase(fetchFewSubscription.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchFewSubscription.fulfilled, (state, action) => {
      state.subscriptions = action.payload.msg;
    });
    builder.addCase(fetchFewSubscription.rejected, (state) => {
      state.subscriptions = [];
    });
    // 
    // fetchSubscription
    builder.addCase(fetchSubscription.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSubscription.fulfilled, (state, action) => {
      state.subscriptions = action.payload.msg;
    });
    builder.addCase(fetchSubscription.rejected, (state) => {
      state.subscriptions = [];
    });
    // 
    // fetchSubscription
    builder.addCase(fetchSubscriptionNo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSubscriptionNo.fulfilled, (state, action) => {
      state.subscriptionNo = action.payload.msg;
    });
    builder.addCase(fetchSubscriptionNo.rejected, (state) => {
      state.subscriptionNo = 0;
    });
    // filterMusic
    builder.addCase(filterMusic.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(filterMusic.fulfilled, (state, action) => {
      state.musics = action.payload.msg;
    });
    builder.addCase(filterMusic.rejected, (state, action) => {
      console.log(action);
      state.musics = [];
    });
    // 
    // logUser
    builder.addCase(logUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logUser.fulfilled, (state, action) => {
      state.loading = false;
      state.owner = action.payload;
      state.error = null;
    });
    builder.addCase(logUser.rejected, (state) => {
      state.loading = false;
    });
    // createMusic
    builder.addCase(createMusic.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createMusic.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload;
      state.error = null;
    });
    builder.addCase(createMusic.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // createMusic
    builder.addCase(endandClaimBounty.pending, () => {
    });
    builder.addCase(endandClaimBounty.fulfilled, (state, action) => {
      state.success = action.payload.msg;
      state.error = null;
    });
    builder.addCase(endandClaimBounty.rejected, (state, action) => {
      state.error = action.payload.error;
    });
  },


  reducers: {
    setPlaying: (state, action) => {
      return {
        ...state,
        nowplaying: action.payload
      }
    },
    setPlayingId: (state, action) => {
      return {
        ...state,
        playingId: action.payload
      }
    },
    clear(state) {
      return {
        ...state,
        success: null,
        error: null,
      };
    },
    setMusic(state, action) {
      return {
        ...state,
        music: action.payload,
        playingId: action.payload._id,
        nowplaying: true
      };
    },
    setContract(state, action) {
      return {
        ...state,
        contract: action.payload,
      };
    },
    setProvider(state, action) {
      return {
        ...state,
        provider: action.payload,
      };
    }
  },
});

export const { setPlaying, clear, setMusic, setPlayingId, setContract, setProvider } =
  musicSlice.actions;

export default musicSlice.reducer;
