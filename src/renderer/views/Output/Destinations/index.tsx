import React from "react";
import { Accordion, Stack } from "@mantine/core";

import { DestinationConfig } from "../../../components";
import { Output } from "../../../../types";

export default function DestinationsView() {
  return (
    <Stack>
      <Accordion variant="separated" multiple defaultValue={["pgmA"]}>
        <Accordion.Item value="pgmA">
          <Accordion.Control>Program A</Accordion.Control>
          <Accordion.Panel>
            <DestinationConfig output={Output.PGM_A} />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="pgmB">
          <Accordion.Control>Program B</Accordion.Control>
          <Accordion.Panel>
            <DestinationConfig output={Output.PGM_B} />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="pfl">
          <Accordion.Control>Pre-fade Listen</Accordion.Control>
          <Accordion.Panel>
            <DestinationConfig output={Output.PFL} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
