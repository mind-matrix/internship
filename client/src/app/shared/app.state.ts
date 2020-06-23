import { State, StateContext, Action } from '@ngxs/store';
import { SetToken } from './app.actions';

export interface AppStateModel {
    token: string;
}

@State<AppStateModel>({
    name: 'app',
    defaults: {
        token: null
    }
})
export class AppState {
    @Action(SetToken)
    setToken({ patchState }: StateContext<AppStateModel>, { payload }: SetToken) {
        patchState({ token: payload });
    }
}