// ###### 2 => React imports ############
import { useState, useEffect, useRef, useCallback } from 'react'

export const useTimeout = (cbk, delay = 1000, deps = []) => {
	const cbkRef = useRef()

	// Save callback
	useEffect(() => {
		cbkRef.current = cbk
	}, [cbk])

	useEffect(() => {
		const timeoutId = setTimeout(cbkRef.current, delay)

		return () => clearTimeout(timeoutId)
	}, [delay, ...deps])
}

export const useInterval = (cbk, delay = 1000, deps = []) => {
	const cbkRef = useRef()

	// Save callback
	useEffect(() => {
		cbkRef.current = cbk
	}, [cbk])

	useEffect(() => {
		const intervalId = setInterval(cbkRef.current, delay)

		return () => clearInterval(intervalId)
	}, [delay, ...deps])
}
