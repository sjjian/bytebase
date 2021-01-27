import axios from "axios";
import { EnvironmentId, Environment, EnvironmentState } from "../../types";

const state: () => EnvironmentState = () => ({
  environmentList: [],
});

const getters = {
  environmentList: (state: EnvironmentState) => () => {
    return state.environmentList;
  },
};

const actions = {
  async fetchEnvironmentList({ commit }: any) {
    const environmentList = (await axios.get(`/api/environment`)).data.data;

    commit("setEnvironmentList", {
      environmentList,
    });

    return environmentList;
  },

  async createEnvironment(
    { commit }: any,
    { newEnvironment }: { newEnvironment: Environment }
  ) {
    const createdEnvironment = (
      await axios.post(`/api/environment`, {
        data: newEnvironment,
      })
    ).data.data;

    commit("appendEnvironment", {
      newEnvironment: createdEnvironment,
    });

    return createdEnvironment;
  },

  async reorderEnvironmentList(
    { commit }: any,
    { sourceIndex, targetIndex }: { sourceIndex: number; targetIndex: number }
  ) {
    const environmentList = (
      await axios.patch(`/api/environment/order`, {
        data: {
          attributes: {
            sourceIndex,
            targetIndex,
          },
          type: "sortorder",
        },
      })
    ).data.data;

    commit("setEnvironmentList", {
      environmentList,
    });

    return environmentList;
  },

  async patchEnvironmentById(
    { commit }: any,
    {
      environmentId,
      environment,
    }: {
      environmentId: EnvironmentId;
      environment: Environment;
    }
  ) {
    const updatedEnvironment = (
      await axios.patch(`/api/environment/${environmentId}`, {
        data: environment,
      })
    ).data.data;

    commit("replaceEnvironmentInList", {
      updatedEnvironment,
    });

    return updatedEnvironment;
  },

  async deleteEnvironmentById(
    { state, commit }: { state: EnvironmentState; commit: any },
    {
      id,
    }: {
      id: EnvironmentId;
    }
  ) {
    await axios.delete(`/api/environment/${id}`);

    const newList = state.environmentList.filter((item: Environment) => {
      return item.id != id;
    });

    commit("setEnvironmentList", {
      environmentList: newList,
    });
  },
};

const mutations = {
  setEnvironmentList(
    state: EnvironmentState,
    {
      environmentList,
    }: {
      environmentList: Environment[];
    }
  ) {
    state.environmentList = environmentList;
  },
  appendEnvironment(
    state: EnvironmentState,
    {
      newEnvironment,
    }: {
      newEnvironment: Environment;
    }
  ) {
    state.environmentList.push(newEnvironment);
  },

  replaceEnvironmentInList(
    state: EnvironmentState,
    {
      updatedEnvironment,
    }: {
      updatedEnvironment: Environment;
    }
  ) {
    const i = state.environmentList.findIndex(
      (item: Environment) => item.id == updatedEnvironment.id
    );
    if (i != -1) {
      state.environmentList[i] = updatedEnvironment;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
