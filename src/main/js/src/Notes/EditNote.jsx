import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';


import { useManageNote } from '@/Services';

const useStyles = makeStyles(theme => ({
    modalTitle: {
        paddingBottom: theme.spacing(0),
        color: theme.palette.secondary.dark
    },
    form: {
        width: '100%'
    },
    formControl: {
        minWidth: 120
    },
    importantRow: {
        textAlign: "right"
    },
    important: {
        width: 55,
        height: 55,
        marginRight: 0
    },
    importantIcon: {
        fontSize: 30
    },
    buttons: {
        margin: theme.spacing(1, 0, 0)
    },
    quill: {
        height: 250,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(4)
    },
    saveButtons: {
       marginLeft: 'auto',
        textAlign: 'right'
    },
    deleteIcon: {
        width: 55,
        height: 55,
        marginRight: 0
    },
    helperText: {
        marginTop: theme.spacing(2)
    }
}));

const EditNote = (props) => {
    const [noteId, setNoteId] = useState(null);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteDescription, setNoteDescription] = useState('');
    const [noteTag, setNoteTag] = useState('');
    const [noteImportant, setNoteImportant] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [getNote, deleteNote, create, update] = useManageNote();


    useEffect(() => {
        if (props.noteId != null)
            getNote(props.noteId).then(note => {
                setNoteId(note.id);
                setNoteTitle(note.title);
                setNoteDescription(note.description);
                if (note.tag == null) {
                    setNoteTag('');
                } else {
                    setNoteTag(note.tag);
                }
                setNoteImportant(note.important);
                props.setTaskHeader("Edit Note");
            });

    }, [props.noteId]);


    const handleClear = () => {
        setNoteId(null);
        setNoteTitle('');
        setNoteDescription('');
        setNoteTag('');
        setNoteImportant(false);
        props.setTaskHeader("Add Note");
        props.setNoteId(null);
    };


    const handleDeleteNote = () => {
        deleteNote(noteId).then(() => {
            handleClear();
            handleMenuClose();
            props.setReRender(!props.reRender);
        })
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const classes = useStyles();

    return (<Grid container justify="center">
        <Grid item xs={10}>
            <Formik initialValues={{
                    title: noteTitle,
                    description: noteDescription,
                    tag: noteTag,
                    important: noteImportant
                }} validationSchema={Yup.object().shape({
                    title: Yup.string().max(100, 'Title is too long').required('Title is required'),
                    description: Yup.string().max(3000, 'Description is too long').required('Description is required'),
                })} onSubmit={({
                    title,
                    description,
                    tag,
                    important
                }, {setStatus, resetForm}) => {
                    if (tag === '')
                        tag = null;

                    setStatus();
                    if (noteId == null) {
                        create(title, description, tag, important).then(() => {
                            handleClear();
                            resetForm({
                                title: '',
                                description: ''
                            })
                        })
                    } else {
                        update(noteId, title, description, tag, important);

                    }

                }}
                enableReinitialize={true}
                >
                {
                    ({
                        handleSubmit,
                        handleChange,
                        values,
                        touched,
                        setFieldValue,
                        errors,
                    }) => (
                            <form onSubmit={handleSubmit} className={classes.form}>
                                <Grid container={true} spacing={2}>
                                    <Grid item={true} xs={10}>
                                        <TextField
                                            id="title" className={classes.textField}
                                            name="title" label="Title" fullWidth={true}
                                            variant="outlined"
                                            margin="dense"
                                            helperText={touched.title ? errors.title : ""}
                                            error={touched.title && Boolean(errors.title)}
                                            value={values.title}
                                            onChange={handleChange}
                                    />
                                    </Grid>
                                    <Grid item={true} xs={1} className={classes.importantRow}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={() => {
                                                        setFieldValue("important", !values.important)
                                                    }}
                                                    color="primary"
                                                    checked={values.important}
                                                    value="important"
                                                    icon = {<StarBorderIcon className={classes.importantIcon}/>}
                                                    checkedIcon={<StarIcon className={classes.importantIcon}/>}
                                                />
                                            }
                                            className={classes.important}
                                          />
                                    </Grid>
                                    <Grid item xs={1}>
                                        {noteId&&
                                            <React.Fragment>
                                                <IconButton aria-label="Delete" className={classes.deleteIcon} onClick={handleMenuClick}>
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    id="menu"
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleMenuClose}
                                                    getContentAnchorEl={null}
                                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                                                >
                                                    <MenuItem onClick={handleDeleteNote}>Delete Note</MenuItem>
                                                </Menu>
                                            </React.Fragment>
                                        }
                                    </Grid>
                                    <Grid item={true} xs={12}>
                                        <FormControl className={classes.formControl} fullWidth={true}>
                                            <Field name="description">
                                                {
                                                    ({ field }) => <ReactQuill
                                                        value={field.value}
                                                        onChange={field.onChange(field.name)}
                                                        className={classes.quill}
                                                        />
                                                }
                                            </Field>
                                            <FormHelperText
                                            className={classes.helperText}
                                            error={touched.description && Boolean(errors.description)}
                                            >
                                                {touched.description ? errors.description : ""}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} className={classes.buttonRow}>
                                        <Grid container alignItems="center">
                                            <Grid item={true} sm={4}>
                                                <FormControl variant="outlined" className={classes.formControl}>
                                                    <InputLabel htmlFor="tag-outlined">Tag</InputLabel>
                                                    <Select
                                                        value={values.tag}
                                                        onChange={handleChange}
                                                        inputProps={{
                                                            name: 'tag',
                                                            id: 'tag-outlined'
                                                        }}
                                                        input={<OutlinedInput labelWidth={25} name="age" id="outlined-tag" />}
                                                    >
                                                        <MenuItem value="">
                                                            <em>None</em>
                                                        </MenuItem>
                                                        <MenuItem value="WORK">Work</MenuItem>
                                                        <MenuItem value="PERSONAL">Personal</MenuItem>
                                                        <MenuItem value="OTHER">Other</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item sm={4} className={classes.saveButtons}>
                                                <Button color="primary" onClick={handleClear}>
                                                    Cancel
                                                </Button>
                                                <Button color="primary" onClick={handleSubmit}>
                                                    Submit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </form>
                        )
                }
            </Formik>
        </Grid>
    </Grid>)
}

export {
    EditNote
};
