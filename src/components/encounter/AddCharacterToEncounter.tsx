import React from "react";
import { Button, CSSObject, Group, NumberInput, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

import { Encounters } from "~/services/Encounters";
import { ActiveCharacter } from "~/services/ActiveCharacter";

interface EncounterFormProps {
    name: string,
    initiative: number | '',
    totalHp: number | '',
    tmpHp: number | '',
}

export function AddCharacterToEncounter({}: { encounter: Encounters; }) {
    const form = useForm<EncounterFormProps>({
        initialValues: {
            name: '',
            initiative: '',
            totalHp: '',
            tmpHp: '',
        },
        validate: {
            name: (value) => ActiveCharacter.ValidateName(value).join(', ') || null,
        }
    });


    const input: CSSObject = { textAlign: 'center' };
    const label: CSSObject = { width: '100%', textAlign: 'center' };
    return (
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
                        {...form.getInputProps('tmpHp')}
                    />
                </Group>
                <Button type="submit">Add</Button>
            </Stack >
        </form >
    );
}
