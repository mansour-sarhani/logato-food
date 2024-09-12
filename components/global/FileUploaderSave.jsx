import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ClearIcon from "@mui/icons-material/Clear";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Card from "@mui/material/Card";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useFormikContext } from "formik";
import styles from "@/components/global/FileUploaderSave.module.css";

const FileUploaderSave = ({ title, name, number }) => {
	const [files, setFiles] = useState([]);

	const { setFieldValue } = useFormikContext();

	function dataURItoBlob(dataURI) {
		const parts = dataURI.split(",");
		if (parts.length !== 2 || !/^data:/i.test(parts[0])) {
			throw new Error("Invalid data URI");
		}
		const byteString = atob(parts[1]);
		const mimeString = parts[0].split(":")[1].split(";")[0];
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: mimeString });
	}

	function numberValidator(files) {
		if (files.length > 1) {
			return {
				code: "too-many-files",
				message: `You can only upload 1 file`,
			};
		}

		return null;
	}

	const { getRootProps, getInputProps, fileRejections } = useDropzone({
		validator: numberValidator(files),
		onDrop: async (acceptedFiles) => {
			const newFiles = await Promise.all(
				acceptedFiles.map(async (file) => {
					const dataUrl = await new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(reader.result);
						reader.onerror = () =>
							reject(new Error("File reading failed"));
						reader.readAsDataURL(file);
					});
					return {
						dataUrl,
						name: file.name,
						type: file.type,
						preview: URL.createObjectURL(file),
					};
				})
			);

			setFiles((prevFiles) => {
				localStorage.setItem(
					name,
					JSON.stringify([...prevFiles, ...newFiles])
				);
				return [...prevFiles, ...newFiles];
			});

			setFieldValue(name, newFiles);
		},
		maxFiles: 1,
		multiple: false,
	});

	useEffect(() => {
		const savedFiles = JSON.parse(localStorage.getItem(name));
		if (savedFiles) {
			setFiles(
				savedFiles.map((file) => {
					const blob = dataURItoBlob(file.dataUrl);
					const newFile = new File([blob], file.name, {
						type: blob.type,
					});
					return Object.assign(newFile, {
						preview: URL.createObjectURL(newFile),
					});
				})
			);
		}
	}, [name]);

	const fileRejectionItems = fileRejections.map(({ file, errors }) => (
		<li
			key={file.path}
			style={{ marginBottom: "10px", color: "red", fontSize: "12px" }}
		>
			File Name: {file.path}({file.size} bytes)
			<ul>
				{errors.map((e) => (
					<li key={e.code}>{e.message}</li>
				))}
			</ul>
		</li>
	));

	const renderFilePreview = (file) => {
		if (file.type?.startsWith("image")) {
			return (
				<Image
					width={38}
					height={38}
					alt={file.name}
					src={file.preview}
				/>
			);
		} else {
			return <FileCopyIcon />;
		}
	};

	const handleRemoveFile = (fileToRemove) => {
		setFiles((prevFiles) => {
			const newFiles = prevFiles.filter(
				(file) => file.name !== fileToRemove.name
			);
			localStorage.setItem(name, JSON.stringify(newFiles));
			return newFiles;
		});
	};

	const fileList = files.map((file) => (
		<ListItem
			key={file.name}
			sx={{
				border: "1px solid #eee",
				justifyContent: "space-between",
				mt: "10px",
				mb: "10px",
			}}
			className="dark-border"
		>
			<div className={styles.fileDetails}>
				<div className={styles.filePreview}>
					{renderFilePreview(file)}
				</div>
				<div>
					<Typography className={styles.fileName}>
						{file.name}
					</Typography>
				</div>
			</div>
			<IconButton onClick={() => handleRemoveFile(file)}>
				<ClearIcon />
			</IconButton>
		</ListItem>
	));

	const handleLinkClick = (event) => {
		event.preventDefault();
	};

	const handleRemoveAllFiles = () => {
		setFiles([]);
		localStorage.removeItem(name);
	};

	return (
		<Card
			sx={{
				boxShadow: "none",
				borderRadius: "10px",
			}}
		>
			<Typography
				as="h3"
				sx={{
					fontSize: 18,
					fontWeight: 500,
					mb: "5px",
				}}
			>
				{title}
			</Typography>

			<div {...getRootProps()} className={styles.dropzone}>
				<input {...getInputProps()} />
				<Box
					sx={{
						display: "flex",
						flexDirection: ["column", "column", "row"],
						alignItems: "center",
					}}
				>
					<Image
						width={80}
						height={80}
						alt="Upload img"
						src="/assets/images/front/upload.webp"
						className={styles.thumbImage}
					/>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							textAlign: ["center", "center", "inherit"],
						}}
					>
						<Typography color="textSecondary">
							برای بارگذاری تصویر اینجا کلیک کنید{" "}
							<Link href="/" onClick={handleLinkClick}>
								جستجو در سیستم
							</Link>{" "}
						</Typography>
						{number !== 1 && (
							<Typography color="textSecondary">
								برای بارگذاری چند تصویر، تصاویر مورد نظر را یکجا
								بکشید و رها کنید
							</Typography>
						)}
					</Box>
				</Box>
			</div>

			{files.length ? (
				<Fragment>
					<List>{fileList}</List>
					<div className={styles.buttons}>
						<Button
							color="error"
							variant="contained"
							onClick={handleRemoveAllFiles}
							sx={{
								textTransform: "capitalize",
								color: "#fff !important",
							}}
						>
							Remove All
						</Button>
					</div>
				</Fragment>
			) : null}
			{fileRejectionItems.length !== 0 && (
				<>
					<Typography
						as="h5"
						sx={{
							fontSize: 14,
							color: "red",
							marginTop: "15px",
							marginBottom: "15px",
						}}
					>
						ERROR
					</Typography>
					<ul style={{ margin: "0", padding: "0" }}>
						{fileRejectionItems}
					</ul>
				</>
			)}
		</Card>
	);
};

export default FileUploaderSave;
