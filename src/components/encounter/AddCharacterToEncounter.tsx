import React from "react";
import { Button, Group, NumberInput, Stack, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

import { Encounters } from "~/services/Encounters";

export function AddCharacterToEncounter({ }: { encounter: Encounters; }) {
    const form = useForm({
        initialValues: {
            name: '',
            initiative: 0,
            totalHp: 0,
            tmpHp: 0,
        },
    });


    return (
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <Stack>
                <Title order={4}>Add Character</Title>

                <TextInput label="Name" {...form.getInputProps('name')} />
                <NumberInput label="Initiative" hideControls {...form.getInputProps('initiative')} />
                <Group position="apart" grow>
                    <NumberInput
                        styles={{ input: { textAlign: 'center' }, label: { width: '100%', textAlign: 'center' } }}
                        label="Total HP"
                        hideControls
                        {...form.getInputProps('totalHp')}
                    />
                    <NumberInput
                        styles={{ input: { textAlign: 'center' }, label: { width: '100%', textAlign: 'center' } }}
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
