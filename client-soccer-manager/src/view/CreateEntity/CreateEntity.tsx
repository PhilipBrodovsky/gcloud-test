import {
    Button,
    Card,
    CardActions,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import { useFirebaseApi } from "firebase-api";
import { addDoc, doc } from "firebase/firestore";
import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { entityName } from "utils/entity";

interface Group {
    id: string;
    name: string;
    players: string[];
}

interface Group {
    id: string;
    name: string;
    image: string;
}

const playerFields = [
    { name: "name", label: "Name", defaultValue: "" },
    { name: "image", label: "Image", defaultValue: "", type: "file" },
];

const groupFields = [
    { name: "name", label: "Name", defaultValue: "" },

    {
        name: "players",
        label: "Players",
        type: "select",
        list: [
            { label: "itay", value: 1 },
            { label: "gal", value: 2 },
        ],
        defaultValue: [],
        selectProps: { multiple: true },
    },
];

interface FieldProps {
    field: any;
    value?: any;
    onChange?: (name: string, value: any) => void;
}

function Field(props: FieldProps) {
    const { field, value, onChange } = props;

    const hanldeChange = (
        event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value: newValue } = event.target;
        onChange?.(name, newValue);
    };

    return (
        <TextField
            autoComplete="off"
            onChange={hanldeChange}
            value={value || field.defaultValue}
            name={field.name}
            label={field.label}
            select={field.type === "select"}
            SelectProps={field.selectProps}
            children={
                field.type === "select" &&
                field.list.map((option: { value: any; label: string }) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))
            }
        />
    );
}

const getEntityData = (entity: string) => {
    const colName = entity + "s";
    return {
        collection: colName,
        path: "/" + colName,
    };
};

interface CreateEntityProps {}

export const CreateEntity = (props: CreateEntityProps) => {
    const { entity } = useParams<{ entity: entityName }>();

    const firebaseApi = useFirebaseApi();

    const entityData = getEntityData(entity!);

    const navigate = useNavigate();

    const [form, setForm] = useState<{ [key: string]: any }>({});
    console.log("form", form);

    const onChange = (name: string, value: any) => {
        setForm({ ...form, [name]: value });
    };

    let formFields = null;

    const createGroup = async () => {
        const res = await firebaseApi.firesotre.createDoc({
            collectionName: entityData.collection,
            data: form,
        });
        console.log("res", res);
        setForm({});
        navigate(entityData.path);
    };

    if (entity === "groups") {
        formFields = groupFields.map((field, index) => {
            return (
                <Field
                    value={form[field.name]}
                    onChange={onChange}
                    field={field}
                    key={index}
                />
            );
        });
    }
    if (entity === "players") {
        formFields = playerFields.map((field, index) => {
            return (
                <Field
                    value={form[field.name]}
                    onChange={onChange}
                    field={field}
                    key={index}
                />
            );
        });
    }

    return (
        <Stack
            data-testid="CreateEntity"
            component={Card}
            p={2}
            gap={2}
            maxWidth={550}
            width="100%"
        >
            {formFields}
            <Button
                onClick={createGroup}
                fullWidth
                variant="contained"
                size="large"
            >
                Create
            </Button>
        </Stack>
    );
};
