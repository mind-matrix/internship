import { State, StateContext, Action } from '@ngxs/store';
import { SetToken, UpdateProfile } from './app.actions';

import axios from 'axios';

export interface AppStateModel {
    token: string;
    profile: any;
}

@State<AppStateModel>({
    name: 'app',
    defaults: {
        token: null,
        profile: null
    }
})
export class AppState {
    @Action(SetToken)
    setToken({ patchState }: StateContext<AppStateModel>, { payload }: SetToken) {
        patchState({ token: payload });
    }
    @Action(UpdateProfile)
    async updateProfile({ patchState, getState }: StateContext<AppStateModel>, {}: UpdateProfile) {
        let state = getState();
        axios.get('/api/me', {
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'authorization': state.token
            }
        }).then((response) => {
            console.log(response.data);
            patchState({ profile: response.data });
        });
    }
}