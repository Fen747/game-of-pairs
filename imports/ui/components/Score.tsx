// ###### 1 => Meteor imports ############

// ###### 2 => React imports #############
import React, { memo, useContext } from 'react'

// ###### 3 => Npm imports ###############

// ###### 4 => Local folder imports ######

// ###### 5 => Local app imports #########
import { GameContext, GameState } from './Game'

interface IScoreProps {}

const Score: React.FC<IScoreProps> = () => {
	const { state, actions } = useContext<GameState>(GameContext)

	return (
		<div>
			<div>Spent time : {state.spentTime.toFixed(1)}</div>
			<button onClick={actions.restart}>Restart</button>
		</div>
	)
}

export default memo(Score)
