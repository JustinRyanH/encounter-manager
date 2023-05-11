import { Button, CSSObject, Group, NumberInput, Stack, TextInput } from "@mantine/core";
import { v4 } from "uuid";
import { useForm } from "@mantine/form";

import { Encounter } from "~/services/encounter/Encounter";
import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";
import { HitPoints } from "~/services/encounter/HitPoints";
import { notifyErrors } from "~/services/notifications";

interface EncounterFormProps {
    name: string,
    initiative: number | '',
    totalHp: number | '',
    tempHp: number | '',
}

interface AddCharacterToEncounterProps {
    encounter: Encounter;
    onSuccess?: () => void;
}

export function AddCharacterToEncounter({ encounter, onSuccess }: AddCharacterToEncounterProps) {
    const form = useForm<EncounterFormProps>({
        initialValues: {
            name: '',
            initiative: '',
            totalHp: '',
            tempHp: '',
        },
        validate: {
            name: (value) => ActiveCharacter.ValidateName(value).join(', ') || null,
            initiative: (value) => ActiveCharacter.ValidateInitiative(value || null).join(', ') || null,
            totalHp: (value) => HitPoints.ValidateTotal(value || null).join(', ') || null,
            tempHp: (value) => HitPoints.ValidateTemp(value || null).join(', ') || null,
        }
    });


    const input: CSSObject = { textAlign: 'center' };
    const label: CSSObject = { width: '100%', textAlign: 'center' };
    const handleSuccess = (values: EncounterFormProps) => {
        if (!values.initiative || !values.totalHp) return;
        const newCharacter = ActiveCharacter.newCharacter({
            id: v4(),
            name: values.name,
            initiative: values.initiative,
            maxHp: values.totalHp,
            tempHp: values.tempHp || null,
        });
        encounter.addCharacter(newCharacter);
        form.reset();
        onSuccess && onSuccess();
    };
    const handleError = () => {
        notifyErrors({ errors: 'some fields are invalid', title: 'Cannot Add Character' });
    };

    const onSubmit = form.onSubmit(handleSuccess, handleError)
    return (
        <form onSubmit={onSubmit}>
            <Stack>
                <TextInput data-autofocus styles={{ input, label }} label="Name" withAsterisk {...form.getInputProps('name')} />
                <NumberInput styles={{ input, label }} label="Initiative" withAsterisk hideControls {...form.getInputProps('initiative')} />
                <Group position="apart" align="start" grow>
                    <NumberInput
                        styles={{ input, label }}
                        label="Total HP"
                        hideControls
                        withAsterisk
                        {...form.getInputProps('totalHp')}
                    />
                    <NumberInput
                        styles={{ input, label }}
                        label="Temp HP"
                        hideControls
                        {...form.getInputProps('tempHp')}
                    />
                </Group>
                <Button type="submit">Add</Button>
            </Stack >
        </form >
    );
}
