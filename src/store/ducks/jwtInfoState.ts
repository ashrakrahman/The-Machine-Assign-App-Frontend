import { AnyAction, Store } from "redux";
import SeamlessImmutable from "seamless-immutable";

export interface JwtInfoState {
  hasToken: boolean;
}

export const SET_HAS_TOKEN_STATUS = "SET_HAS_TOKEN_STATUS";

// Actions

/** interface for SET_FORM_SUBMIT_STATUS action */
export interface SetHasTokenStatusActionInterface extends AnyAction {
  hasToken: boolean;
  type: typeof SET_HAS_TOKEN_STATUS;
}

// this action method to be used in containers
/** sets the token info status to redux store
 * @param {boolean} hasToken - the token info variable
 * @returns {SetHasTokenStatusActionInterface} - an action to set token info to redux store
 */
export const setHasTokenStatusAction = (
  hasToken: boolean
): SetHasTokenStatusActionInterface => ({
  hasToken,
  type: SET_HAS_TOKEN_STATUS
});

/** Create type for token reducer actions */
export type tokenActionTypes = SetHasTokenStatusActionInterface | AnyAction;

/** Create an immutable form state */
export type ImmutableJwtInfoState = SeamlessImmutable.ImmutableObject<
  JwtInfoState
>;

/** initial form state */
export const initialState: ImmutableJwtInfoState = SeamlessImmutable({
  hasToken: false
});

// Reducers

/** the form reducer function */
export default function reducer(
  state: ImmutableJwtInfoState = initialState,
  action: tokenActionTypes
): ImmutableJwtInfoState {
  switch (action.type) {
    case SET_HAS_TOKEN_STATUS:
      return SeamlessImmutable({
        ...state,
        hasToken: (action as any).hasToken
      });
    default:
      return state;
  }
}

// selectors

/** get the info object from store
 * @param {Partial<Store>} state - the redux store
 * @return {boolean} the current hasToken
 */
export function getHasTokenStatus(state: Partial<Store>): any {
  return (state as any).hasToken;
}
