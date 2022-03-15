import React, { useState } from "react"
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from "react-places-autocomplete"
import StarIcon from "@mui/icons-material/Star"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import LocalPhoneIcon from "@mui/icons-material/LocalPhone"
import PublicIcon from "@mui/icons-material/Public"
import Chip from "@mui/material/Chip"
import { GoogleApiWrapper, Map } from "google-maps-react"

const HotelAutoSearchInput = () => {
	const [address, setAddress] = useState("")
	const [details, setDetails] = useState({})

	const handleChange = (addressLocation) => {
		console.log("address location  : ", addressLocation)
		setAddress(addressLocation)
	}

	const google = window.google

	const getPlaceDetails = (place_id) => {
		const mapsss = new google.maps.Map(
			document.getElementById("google_map_show"),
			{
				center: { lat: -33.866, lng: 151.196 },
				zoom: 15,
			}
		)

		const request = {
			placeId: place_id,
			fields: [
				"types",
				"name",
				"website",
				"photo",
				"rating",
				"price_level",
				"user_ratings_total",
				"international_phone_number",
				"icon",
				"icon_background_color",
				"formatted_address",
				"geometry",
			],
		}

		const service = new google.maps.places.PlacesService(mapsss)

		service.getDetails(request, (place, status) => {
			if (
				status === google.maps.places.PlacesServiceStatus.OK &&
				place &&
				place.geometry &&
				place.geometry.location
			) {
				console.log(place.photos[0].getUrl())
				setDetails(place)
			}
		})
	}

	const handleSelect = (addres) => {
		geocodeByAddress(addres)
			.then((results) => {
				getPlaceDetails(results[0].place_id)
			})
			.catch((error) => console.error("Error", error))
	}

	return (
		<Map google={google}>
			<div style={styles.searchContainer}>
				//this div is to display only search bar
				<PlacesAutocomplete
					value={address}
					onChange={handleChange}
					onSelect={handleSelect}
				>
					{({
						getInputProps,
						suggestions,
						getSuggestionItemProps,
						loading,
					}) => (
						<div>
							<input
								{...getInputProps({
									placeholder: "Search Places ...",
									className: "location-search-input",
								})}
								style={{ width: "100%" }}
							/>
							<div className="autocomplete-dropdown-container">
								{loading && <div>Loading...</div>}
								{suggestions.map((suggestion) => {
									const className = suggestion.active
										? "suggestion-item--active"
										: "suggestion-item"
									// inline style for demonstration purpose
									const style = suggestion.active
										? { backgroundColor: "#fafafa", cursor: "pointer" }
										: { backgroundColor: "#ffffff", cursor: "pointer" }
									return (
										<div
											{...getSuggestionItemProps(suggestion, {
												className,
												style,
											})}
										>
											<span>{suggestion.description}</span>
										</div>
									)
								})}
							</div>
						</div>
					)}
				</PlacesAutocomplete>
			</div>
			<div style={styles.container}>
				<div style={styles.mainContainer}>
					<div style={styles.gridContainer}>
						<img
							style={{
								marginRight: 10,
								backgroundColor: details.icon_background_color,
							}}
							src={details.icon}
							alt="Trulli"
							width="50"
							height="50"
						/>
						<h4>{details.name}</h4>
					</div>

					<p>description.................................</p>

					<div style={styles.gridContainer}>
						{details.types &&
							details.types.map((element, index) => <Chip label={element} />)}
					</div>

					<div style={styles.gridContainer}>
						<StarIcon sx={{ color: "#FDCC0D" }} />
						<h5>
							{details.rating} ({details.user_ratings_total})
						</h5>
					</div>

					<div style={styles.gridContainer}>
						<LocationOnIcon />
						<h5>{details.formatted_address}</h5>
					</div>

					<div style={styles.gridContainer}>
						<LocalPhoneIcon />
						<h5>{details.international_phone_number}</h5>
					</div>

					<div style={styles.gridContainer}>
						<PublicIcon sx={{ color: "red" }} />
						<p>
							<a href={details.website}>{details.website}</a>
						</p>
					</div>
				</div>
			</div>
		</Map>
	)
}

const styles = {
	gridContainer: {
		display: "grid",
		gridTemplateColumns: "auto auto auto auto",
		gridGap: "10px",
		textAlign: "start",
		justifyContent: "start",
		alignItems: "center",
	},
	mainContainer: {
		display: "grid",
		gridTemplateColumns: "auto",
		gridGap: "10px",
		textAlign: "center",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
		width: "80%",
		borderRadius: 20,
		zIndex: 9,
		position: "absolute",
	},
	container: {
		backgroundColor: "white",
		width: "100%",
		height: "100%",
		display: "flex",
		alignItems: "flex-end",
		justifyContent: "center",
	},
	searchContainer: {
		position: "absolute",
		zIndex: 9,
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
}

export default GoogleApiWrapper({
	apiKey: "AIzaSyCkIdp1ZbRPtNQ0vZuJgpx8pdlmTrKWts4",
})(HotelAutoSearchInput)
