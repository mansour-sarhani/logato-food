import { forwardRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import userUpdateAddress from "@/functions/user/userUpdateAddress";
import getUserAddresses from "@/functions/user/getUserAddresses";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="down" ref={ref} {...props} />;
});

export default function HeaderAddress() {
	const [addresses, setAddresses] = useState();
	const [selectedAddressId, setSelectedAddressId] = useState();
	const [open, setOpen] = useState(false);
	const [doReload, setDoReload] = useState(true);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChangeDefault = (event) => {
		setSelectedAddressId(event.target.value);
	};

	const saveNewDefaultAddress = () => {
		if (addresses.find((addr) => addr.default)._id !== selectedAddressId) {
			async function updateDefaultAddress() {
				const data = {
					addressId: selectedAddressId,
					default: true,
				};
				await userUpdateAddress(dispatch, enqueueSnackbar, data);
				setDoReload(true);
				setOpen(false);
			}
			updateDefaultAddress();
		}
	};

	useEffect(() => {
		if (doReload) {
			async function getAddresses() {
				await getUserAddresses(dispatch, enqueueSnackbar, setAddresses);
			}
			getAddresses();
			setDoReload(false);
		}
	}, [doReload]);

	// useEffect(() => {
	// 	if (addresses) {
	// 		setSelectedAddressId(addresses.find((addr) => addr.default)._id);
	// 	}
	// }, [addresses]);

	return (
		addresses && (
			<>
				<div className="header-address" onClick={handleClickOpen}>
					<GpsFixedIcon />
					{addresses.length > 0 ? (
						<div className="header-default-address">
							<Typography variant="body">
								{addresses.find((addr) => addr.default).title}
							</Typography>
							<Typography variant="body2">
								(
								{addresses.find((addr) => addr.default).address}
								)
							</Typography>
						</div>
					) : (
						"آدرس خود را انتخاب کنید"
					)}
				</div>
				<Dialog
					open={open}
					TransitionComponent={Transition}
					keepMounted
					onClose={handleClose}
					aria-describedby="user-addresses-modal"
				>
					<DialogTitle>
						{"آدرس پیش فرض خود را انتخاب کنید"}
					</DialogTitle>
					<DialogContent>
						{addresses.length > 0 ? (
							<FormControl>
								<RadioGroup
									aria-labelledby="user-address"
									defaultValue=""
									name="radio-buttons-group"
								>
									{addresses.map((address) => (
										<FormControlLabel
											value={address._id}
											control={<Radio />}
											label={address.title}
											checked={
												selectedAddressId ===
												address._id
											}
											key={address._id}
											onChange={handleChangeDefault}
										/>
									))}
								</RadioGroup>
							</FormControl>
						) : (
							"آدرس خود را انتخاب کنید"
						)}
					</DialogContent>
					<DialogActions>
						<Button color="error" onClick={handleClose}>
							بستن
						</Button>
						<Button
							variant="contained"
							onClick={saveNewDefaultAddress}
						>
							ذخیره
						</Button>
					</DialogActions>
				</Dialog>
			</>
		)
	);
}
