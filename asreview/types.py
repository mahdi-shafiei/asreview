# Copyright 2019-2025 The ASReview Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

__all__ = []


def type_n_queries(value):
    """Custom type used for --n_queries argument.

    Parameters
    ----------
    value: str
        The argument value for --n_queries

    Returns
    -------
    type_n_queries:
        A string containing 'min' or an integer.
    """
    if value == "min":
        return value
    else:
        try:
            value_i = int(value)

            # convert -1 to None
            if value_i == -1:
                return None

            return value_i
        except ValueError:
            raise ValueError("Expected 'min' or a valid integer")
