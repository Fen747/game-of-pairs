// ###### 1 => Meteor imports ############

// ###### 2 => React imports #############
import React, {
	memo,
	useReducer,
	useEffect,
	createContext,
	useMemo,
	useCallback,
	useState,
} from 'react'

// ###### 3 => Npm imports ###############

// ###### 4 => Local folder imports ######
import Board from './Board'
import Score from './Score'

// ###### 5 => Local app imports #########
import { useTimeout, useInterval } from '../hooks'

interface IGameProps {}

enum ACTIONS {
	HIDE_ALL,
	FIND_CARDS,
	INC_TIME,
	GENERATE_CARDS,
	SELECT_CARD,
	RESET,
}

export type Cards = number[]

type ReducerState = {
	showAll: boolean
	cards: Cards
	selected: [number?, number?]
	foundCardIndexes: number[]
	spentTime: number
}

type Payload = {
	cards?: Cards
	selectedIndex?: number
	nbOfPairs?: number
}

type DispatchedAction = {
	type: ACTIONS
	payload?: Payload
}

interface ActionHandlers {
	[key: string]: () => void
}

export type GameState = {
	actions: ActionHandlers
	state: ReducerState
}

const initlaState: ReducerState = Object.freeze({
	showAll: true,
	cards: [],
	selected: [],
	foundCardIndexes: [],
	spentTime: 0,
})

const reducer = (state: ReducerState, action: DispatchedAction) => {
	switch (action.type) {
		case ACTIONS.HIDE_ALL:
			return { ...state, selected: [], showAll: false }

		case ACTIONS.GENERATE_CARDS:
			return { ...state, cards: action.payload.cards }

		case ACTIONS.FIND_CARDS:
			return {
				...state,
				foundCardIndexes: [
					...state.foundCardIndexes,
					...state.selected,
				],
			}

		case ACTIONS.SELECT_CARD:
			return {
				...state,
				selected:
					state.selected.length < 2
						? [...state.selected, action.payload.selectedIndex]
						: state.selected,
			}

		case ACTIONS.INC_TIME:
			return { ...state, spentTime: state.spentTime + 0.1 }

		case ACTIONS.RESET:
			return {
				...initlaState,
				cards: createSetsOfPairs(action.payload.nbOfPairs),
			}

		default:
			return state
	}
}

const generateRandomNumber = (min: number, max: number): number => {
	const intMin = Math.ceil(min)
	const intMax = Math.floor(max)

	return Math.floor(Math.random() * (intMax - intMin + 1)) + intMin + 1
}

const generatePositiveRandomNumber = (max) => generateRandomNumber(0, max)

const generatePositiveNumberNotIn = (max, excluded) => {
	let n = generateRandomNumber(1, max)

	while (excluded.includes(n)) {
		n = generatePositiveRandomNumber(max)
	}

	return n
}

const createSetsOfPairs = (n = 5) => {
	const countPairs = {}
	const cards = []
	const excluded = []
	const length = n * 2
	let i = -1

	while (++i < length) {
		const rand = generatePositiveNumberNotIn(n - 1, excluded)

		if (!countPairs[`${rand}`]) {
			countPairs[`${rand}`] = 1
		} else {
			countPairs[`${rand}`] = 2
			excluded.push(rand)
		}

		cards.push(rand)
	}

	return cards
}

export const GameContext = createContext(initlaState)

const Game: React.FC<IGameProps> = (props) => {
	const reducerTuple = useReducer<ReducerState>(reducer, initlaState)
	const [state, dispatch] = reducerTuple
	const won = state.foundCardIndexes.length === state.cards.length
	const [nbOfPairs, setNbOfPairs] = useState(5)

	useTimeout(
		() => {
			dispatch({ type: ACTIONS.HIDE_ALL })
		},
		2500,
		[state.showAll],
	)

	useInterval(
		() => {
			if (!won) {
				dispatch({ type: ACTIONS.INC_TIME })
			}
		},
		100,
		[state.showAll, won],
	)

	useEffect(() => {
		if (state.selected.length === 2) {
			if (
				state.cards[state.selected[0]] ===
				state.cards[state.selected[1]]
			) {
				dispatch({ type: ACTIONS.FIND_CARDS })
			}

			const timeoutId = setTimeout(
				() => dispatch({ type: ACTIONS.HIDE_ALL }),
				500,
			)

			return () => clearTimeout(timeoutId)
		}
	}, [state.selected])

	const selectCard = useCallback((selectedIndex) => {
		dispatch({ type: ACTIONS.SELECT_CARD, payload: { selectedIndex } })
	}, [])

	const restart = useCallback(() => {
		dispatch({ type: ACTIONS.RESET, payload: { nbOfPairs } })
	}, [nbOfPairs])

	const contextValue = useMemo(
		() => ({
			state,
			actions: {
				selectCard,
				restart,
			},
		}),
		[state, selectCard, restart],
	)

	return (
		<GameContext.Provider value={contextValue}>
			<div className="flex">
				<Board cards={state.cards} />
				<div>
					<div>{won ? <div>Congratulations !</div> : null}</div>
					<label htmlFor="nbOfPairs">Number of pairs</label>
					<input
						id="nbOfPairs"
						type="number"
						min="2"
						max="50"
						value={nbOfPairs}
						onChange={(event) => setNbOfPairs(event.target.value)}
					/>
					<Score />
				</div>
			</div>
		</GameContext.Provider>
	)
}

export default memo(Game)
