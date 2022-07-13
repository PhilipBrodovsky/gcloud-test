import { Button, Card, Stack } from "@mui/material";
import { Field } from "components/Field/Field";
import { useGroupForm } from "Entities";
import { useFirebaseApi } from "firebase-api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateGroupPage = () => {
    const groupForm = useGroupForm();

    const firebaseApi = useFirebaseApi();

    const navigate = useNavigate();

    const [form, setForm] = useState<{ [key: string]: any }>({});

    const onChange = (name: string, value: any) => {
        setForm({ ...form, [name]: value });
    };

    let formFields = null;

    const createGroup = async (event) => {
        event.preventDefailt();
        const { image, ...rest } = form;
        const docRef = firebaseApi.firesotre.getDocRef({
            collectionName: "groups",
        })!;

        const file =
            image &&
            (await firebaseApi.storage.uploadFile(
                image,
                `groups/${docRef.id}`
            ));
        const res = await firebaseApi.firesotre.createDoc({
            ref: docRef,
            data: { ...rest, image: file?.data || null },
        });

        setForm({});
        navigate("/groups");
    };

    formFields = groupForm.fields.map((field, index) => {
        return (
            <Field
                required
                value={form[field.name]}
                onChange={onChange}
                field={field}
                key={index}
            />
        );
    });

    return (
        <Stack
            data-testid="CreateEntity"
            component={"form"}
            p={2}
            gap={2}
            maxWidth={550}
            width="100%"
            onSubmit={createGroup}
        >
            {formFields}
            <Button fullWidth variant="contained" size="large" type="submit">
                Create
            </Button>
        </Stack>
    );
};
