import React from "react";
import { Button, CSSObject, Group, NumberInput, Stack, TextInput, Title } from "@mantine/core";
import { FormErrors, useForm } from "@mantine/form";

import { Encounters } from "~/services/Encounters";
import { ActiveCharacter } from "~/services/ActiveCharacter";
import { HitPoints } from "~/services/HitPoints";

interface EncounterFormProps {
    name: string,
    initiative: number | '',
    totalHp: number | '',
    tempHp: number | '',
}

export function AddCharacterToEncounter({ encounter }: { encounter: Encounters; }) {
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
        }
    });


    const input: CSSObject = { textAlign: 'center' };
    const label: CSSObject = { width: '100%', textAlign: 'center' };
    const onSubmit = form.onSubmit((values: EncounterFormProps) => {
        if (!values.initiative || !values.totalHp) return;
        const newCharacter = ActiveCharacter.newCharacter({
            name: values.name,
            initiative: values.initiative,
            hp: values.totalHp,
            tempHp: values.tempHp || null,
        });
        encounter.addCharacter(newCharacter);
        form.reset();
    }, (errors: FormErrors) => console.log(errors))
    return (
        <form onSubmit={onSubmit}>
            <Stack>
                <Title order={4}>Add Character</Title>

                <TextInput styles={{ input, label }} label="Name" required {...form.getInputProps('name')} />
                <NumberInput styles={{ input, label }} label="Initiative" hideControls required {...form.getInputProps('initiative')} />
                <Group position="apart" grow>
                    <NumberInput
                        styles={{ input, label}}
                        label="Total HP"
                        hideControls
                        required
                        {...form.getInputProps('totalHp')}
                    />
                    <NumberInput
                        styles={{ input, label }}
                        label="Temporary HP"
                        hideControls
                        {...form.getInputProps('tempHp')}
                    />
                </Group>
                <Button type="submit">Add</Button>
            </Stack >
        </form >
    );
}
