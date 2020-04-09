// ###### 1 => Meteor imports ############

// ###### 2 => React imports #############
import React, { memo, useContext, useState, useEffect } from 'react'

// ###### 3 => Npm imports ###############

// ###### 4 => Local folder imports ######

// ###### 5 => Local app imports #########
import { GameContext, GameState } from './Game'
import { useInterval } from '../hooks'

interface IScoreProps {}

const Score: React.FC<IScoreProps> = () => {
	const { state, actions } = useContext<GameState>(GameContext)
	const [spentTime, setSpentTime] = useState(0)

	useInterval(
		() => {
			if (!state.won) {
				setSpentTime((actualSpentTime) => actualSpentTime + 0.1)
			}
		},
		100,
		[state.won],
	)

	useEffect(() => {}, [state.won])

	return (
		<div>
			<div>Spent time : {spentTime.toFixed(1)}</div>
			<button onClick={actions.restart}>Restart</button>
		</div>
	)
}

export default memo(Score)
